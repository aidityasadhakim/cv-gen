#!/bin/bash
#
# CV-Gen PostgreSQL Systemd Setup Script
# Run this on the server to set up PostgreSQL as a systemd service
#
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

PG_VERSION="16"
PG_USER="cvgen"
PG_PASSWORD="${PG_PASSWORD:-}"
DB_NAME="${DB_NAME:-cvgen_db}"
DATA_DIR="/var/lib/postgresql/${PG_VERSION}/main"
CONF_DIR="/etc/postgresql/${PG_VERSION}/main"

# Detect project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${PROJECT_ROOT}/.env"
MIGRATIONS_DIR="${PROJECT_ROOT}/backend/sql/migrations"

usage() {
  echo "CV-Gen PostgreSQL Systemd Setup"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  install     Install and configure PostgreSQL (reads from .env)"
  echo "  start       Start the PostgreSQL service"
  echo "  stop        Stop the PostgreSQL service"
  echo "  restart     Restart the PostgreSQL service"
  echo "  status      Check service status"
  echo "  enable      Enable auto-start on boot"
  echo "  disable     Disable auto-start on boot"
  echo "  migrate     Run database migrations (uses .env DATABASE_URL)"
  echo "  shell       Connect to database shell"
  echo ""
  echo "Environment Variables (from root .env):"
  echo "  DATABASE_URL      Full connection string (recommended)"
  echo "  PG_PASSWORD       PostgreSQL password (used if DATABASE_URL not set)"
  echo "  DB_NAME           Database name (default: cvgen_db)"
  echo ""
  echo "Examples:"
  echo "  # Install and create user from .env"
  echo "  $0 install"
  echo ""
  echo "  # Run migrations"
  echo "  $0 migrate"
  echo ""
  echo "  # Connect to database shell"
  echo "  $0 shell"
}

check_prerequisites() {
  log_info "Checking prerequisites..."

  if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root"
    exit 1
  fi

  if command -v pg_ctl &>/dev/null; then
    log_info "PostgreSQL already installed"
  else
    log_info "Installing PostgreSQL..."
    apt-get update
    apt-get install -y postgresql-${PG_VERSION} postgresql-client-${PG_VERSION}
  fi
}

configure_postgresql() {
  log_info "Configuring PostgreSQL..."

  # Load environment from project root
  if [ -f "$ENV_FILE" ]; then
    log_info "Loading environment from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
  fi

  # Listen on all interfaces (for container access)
  sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" ${CONF_DIR}/postgresql.conf

  # Enable password authentication from any host
  if ! grep -q "host all all 0.0.0.0/0 md5" ${CONF_DIR}/pg_hba.conf; then
    echo "host    all             all             0.0.0.0/0               md5" >>${CONF_DIR}/pg_hba.conf
  fi
  if ! grep -q "host all all ::/0 md5" ${CONF_DIR}/pg_hba.conf; then
    echo "host    all             all             ::/0                    md5" >>${CONF_DIR}/pg_hba.conf
  fi

  log_success "PostgreSQL configured"
}

create_user_and_db() {
  log_info "Creating user and database..."

  # Load password from environment if available
  local password="${PG_PASSWORD:-}"
  if [ -z "$password" ] && [ -f "$ENV_FILE" ]; then
    # Try to extract password from DATABASE_URL
    if [ -n "$DATABASE_URL" ]; then
      # Extract password from postgres://user:password@host:port/db format
      password=$(echo "$DATABASE_URL" | sed -n 's/.*:\([^@]*\)@.*/\1/p')
    fi
  fi

  # Use default if still empty
  if [ -z "$password" ]; then
    password="cvgen_secret"
    log_warn "Using default password (set PG_PASSWORD or DATABASE_URL in .env for production)"
  fi

  local db_name="${DB_NAME}"

  # Create database
  sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE ${db_name};

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${PG_USER}') THEN
        CREATE USER ${PG_USER} WITH PASSWORD '${password}';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${db_name} TO ${PG_USER};
ALTER DATABASE ${db_name} OWNER TO ${PG_USER};
EOF

  log_success "User and database created"
  log_info "User: ${PG_USER}, Database: ${db_name}"
}

install_service() {
  log_info "Installing systemd service..."

  # Copy service file
  cp scripts/cvgen-postgres.service /etc/systemd/system/cvgen-postgres.service
  chmod 644 /etc/systemd/system/cvgen-postgres.service

  # Reload systemd
  systemctl daemon-reload

  log_success "Systemd service installed"
}

start_service() {
  log_info "Starting PostgreSQL..."
  systemctl start cvgen-postgres
  sleep 2
  systemctl status cvgen-postgres --no-pager
}

stop_service() {
  log_info "Stopping PostgreSQL..."
  systemctl stop cvgen-postgres
}

restart_service() {
  log_info "Restarting PostgreSQL..."
  systemctl restart cvgen-postgres
}

enable_service() {
  log_info "Enabling auto-start..."
  systemctl enable cvgen-postgres
}

install_go() {
  if command -v go &>/dev/null; then
    log_info "Go already installed: $(go version)"
    return 0
  fi

  log_info "Installing Go..."

  # Detect architecture
  local arch=$(uname -m)
  local go_arch="amd64"
  if [ "$arch" = "aarch64" ] || [ "$arch" = "arm64" ]; then
    go_arch="arm64"
  elif [ "$arch" = "x86_64" ]; then
    go_arch="amd64"
  fi

  local go_version="1.24.0"
  local go_archive="go${go_version}.linux-${go_arch}.tar.gz"

  cd /tmp
  wget -q "https://go.dev/dl/${go_archive}" -O "$go_archive"
  rm -rf /usr/local/go
  tar -C /usr/local -xzf "$go_archive"
  rm "$go_archive"

  # Add to PATH for this session
  export PATH=/usr/local/go/bin:$PATH
  export PATH=$PATH:$(go env GOPATH 2>/dev/null || echo "$HOME/go")/bin

  # Add to shell profile
  if ! grep -q "/usr/local/go/bin" ~/.bashrc 2>/dev/null; then
    echo 'export PATH=$PATH:/usr/local/go/bin' >>~/.bashrc
  fi

  log_success "Go ${go_version} installed successfully"
}

run_migrations() {
  log_info "Running database migrations..."

  # Install Go if not present
  install_go

  # Ensure goose is in PATH
  export PATH=/usr/local/go/bin:$PATH
  export PATH=$PATH:$(go env GOPATH 2>/dev/null || echo "$HOME/go")/bin

  if ! command -v goose &>/dev/null; then
    log_info "Installing goose..."
    go install github.com/pressly/goose/v3/cmd/goose@latest
  fi

  # Load environment from project root
  if [ -f "$ENV_FILE" ]; then
    log_info "Loading environment from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
  else
    log_error "Environment file not found: $ENV_FILE"
    exit 1
  fi

  # Verify migrations directory exists
  if [ ! -d "$MIGRATIONS_DIR" ]; then
    log_error "Migrations directory not found: $MIGRATIONS_DIR"
    exit 1
  fi

  if [ -n "$DATABASE_URL" ]; then
    log_info "Running migrations with DATABASE_URL..."
    goose -dir "$MIGRATIONS_DIR" postgres "$DATABASE_URL" up
    log_success "Migrations completed"
  else
    log_error "DATABASE_URL not set in $ENV_FILE"
    exit 1
  fi
}

db_shell() {
  log_info "Connecting to database..."
  sudo -u postgres psql -d ${DB_NAME} -U ${PG_USER}
}

main() {
  local command="${1:-}"

  case "$command" in
  install)
    check_prerequisites
    configure_postgresql
    create_user_and_db
    install_service
    start_service
    ;;
  start)
    start_service
    ;;
  stop)
    stop_service
    ;;
  restart)
    restart_service
    ;;
  status)
    systemctl status cvgen-postgres --no-pager
    ;;
  enable)
    enable_service
    ;;
  disable)
    systemctl disable cvgen-postgres
    ;;
  migrate)
    run_migrations
    ;;
  shell)
    db_shell
    ;;
  *)
    usage
    ;;
  esac
}

main "$@"
