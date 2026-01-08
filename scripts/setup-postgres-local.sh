#!/bin/bash
#
# CV-Gen PostgreSQL Local Development Setup Script
# Run this on your local machine to set up PostgreSQL for development
#
# Usage: sudo ./setup-postgres-local.sh [command]
#
# Commands:
#   all         Run full setup (install, configure, user, migrate)
#   install     Install PostgreSQL from official APT repository
#   configure   Configure PostgreSQL (listen on *, password auth)
#   user        Create user and database from .env
#   migrate     Run database migrations with goose
#   start       Start PostgreSQL service
#   stop        Stop PostgreSQL service
#   restart     Restart PostgreSQL service
#   status      Check service status
#   shell       Connect to database shell
#   help        Show this help message
#
set -e

# =============================================================================
# Configuration
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# PostgreSQL version (will use latest from official repo)
PG_REPO_NAME="pgdg"
PG_REPO_URL="https://apt.postgresql.org/pub/repos/apt"

# Detect project root and script directory
# Assume user runs script from project root directory (where .env and backend/ exist)
PROJECT_ROOT="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS_DIR="${PROJECT_ROOT}/backend/sql/migrations"

# Default values (can be overridden by .env)
POSTGRES_USER="${POSTGRES_USER:-cvgen}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
POSTGRES_DB="${POSTGRES_DB:-cvgen_db}"
DATABASE_URL="${DATABASE_URL:-}"

# =============================================================================
# Helper Functions
# =============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Prompt for confirmation
confirm() {
    local prompt="$1"
    local default="${2:-N}"

    if [ "$default" = "Y" ]; then
        read -p "$prompt [Y/n] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]?$ ]]; then
            return 1
        fi
    else
        read -p "$prompt [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    return 0
}

# Find and load environment file
load_env() {
    log_info "Looking for .env file..."

    # Check multiple possible locations
    local possible_locations=(
        "${PROJECT_ROOT}/.env"
        "${SCRIPT_DIR}/../.env"
        "${SCRIPT_DIR}/.env"
        "$(pwd)/.env"
        "${HOME}/.cv-gen/.env"
    )

    for loc in "${possible_locations[@]}"; do
        if [ -f "$loc" ]; then
            ENV_FILE="$loc"
            break
        fi
    done

    if [ -z "$ENV_FILE" ]; then
        log_error "No .env file found in:"
        echo "  - ${PROJECT_ROOT}/.env"
        echo "  - ${SCRIPT_DIR}/../.env"
        echo "  - $(pwd)/.env"
        echo "  - ${HOME}/.cv-gen/.env"
        echo ""
        log_info "Please create a .env file with at least:"
        echo "  POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, DATABASE_URL"
        return 1
    fi

    log_info "Loading environment from: $ENV_FILE"

    # Source the env file
    set -a
    source "$ENV_FILE"
    set +a

    # Update variables from env file
    POSTGRES_USER="${POSTGRES_USER:-cvgen}"
    POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
    POSTGRES_DB="${POSTGRES_DB:-cvgen_db}"
    DATABASE_URL="${DATABASE_URL:-}"

    log_success "Environment loaded"
    log_info "  POSTGRES_USER: $POSTGRES_USER"
    log_info "  POSTGRES_DB: $POSTGRES_DB"
    log_info "  DATABASE_URL: ${DATABASE_URL:0:50}..."

    return 0
}

# Check if running as root
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# =============================================================================
# PostgreSQL Installation
# =============================================================================

install_postgres() {
    log_step "Installing PostgreSQL from official APT repository..."

    if command -v psql &>/dev/null; then
        local current_version=$(psql --version 2>/dev/null | awk '{print $3}')
        log_info "PostgreSQL already installed: $current_version"

        if confirm "Do you want to reinstall/reconfigure?" N; then
            log_info "Proceeding with reinstallation..."
        else
            log_info "Skipping PostgreSQL installation"
            return 0
        fi
    else
        if ! confirm "Install PostgreSQL from official repository?" Y; then
            log_info "Skipping PostgreSQL installation"
            return 0
        fi
    fi

    # Check if PostgreSQL official repo is already added
    if [ ! -f /etc/apt/sources.list.d/pgdg.list ]; then
        log_info "Adding PostgreSQL official APT repository..."

        # Install prerequisites
        apt-get update -qq
        apt-get install -y wget ca-certificates gnupg lsb-release

        # Add PostgreSQL repository key
        wget -qO- "${PG_REPO_URL}/PGDG_KEY.gpg" | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg

        # Add repository
        echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] ${PG_REPO_URL} $(lsb_release -cs)-${PG_REPO_NAME} main" > /etc/apt/sources.list.d/pgdg.list

        log_success "PostgreSQL repository added"
    else
        log_info "PostgreSQL repository already configured"
    fi

    # Install PostgreSQL (latest version available)
    log_info "Installing PostgreSQL..."
    apt-get update -qq
    apt-get install -y postgresql postgresql-contrib

    # Get installed version
    local pg_version=$(psql --version 2>/dev/null | awk '{print $3}')
    log_success "PostgreSQL $pg_version installed successfully"

    return 0
}

# =============================================================================
# PostgreSQL Configuration
# =============================================================================

configure_pg() {
    log_step "Configuring PostgreSQL..."

    if ! command -v psql &>/dev/null; then
        log_error "PostgreSQL is not installed. Run 'install' first."
        return 1
    fi

    if ! confirm "Configure PostgreSQL to accept external connections?" N; then
        log_info "Skipping configuration"
        return 0
    fi

    # Find PostgreSQL config directory
    local pg_version=$(psql --version 2>/dev/null | awk '{print $3}' | cut -d. -f1)
    local conf_dir="/etc/postgresql/${pg_version}/main"
    local conf_file="${conf_dir}/postgresql.conf"
    local hba_file="${conf_dir}/pg_hba.conf"

    if [ ! -f "$conf_file" ]; then
        log_error "PostgreSQL config file not found: $conf_file"
        return 1
    fi

    log_info "Configuring PostgreSQL ${pg_version}..."

    # Configure listen_addresses
    if grep -q "^#listen_addresses" "$conf_file"; then
        sed -i "s/^#listen_addresses = 'es = '*'localhost'/listen_address/" "$conf_file"
        log_info "  - Set listen_addresses to '*'"
    elif grep -q "^listen_addresses" "$conf_file"; then
        sed -i "s/^listen_addresses = '.*'/listen_addresses = '*'/" "$conf_file"
        log_info "  - Updated listen_addresses to '*'"
    fi

    # Configure password authentication
    if [ ! -f "$hba_file" ]; then
        log_error "pg_hba.conf not found: $hba_file"
        return 1
    fi

    # Add IPv4 and IPv6 host-based authentication
    if ! grep -q "host all all 0.0.0.0/0 md5" "$hba_file"; then
        echo "host    all             all             0.0.0.0/0               md5" >> "$hba_file"
        log_info "  - Added IPv4 password authentication"
    fi

    if ! grep -q "host all all ::/0 md5" "$hba_file"; then
        echo "host    all             all             ::/0                    md5" >> "$hba_file"
        log_info "  - Added IPv6 password authentication"
    fi

    log_success "PostgreSQL configured"
    log_info "  - Listening on all interfaces"
    log_info "  - Password authentication enabled"

    return 0
}

# =============================================================================
# User and Database Setup
# =============================================================================

setup_user() {
    log_step "Setting up PostgreSQL user and database..."

    # Load environment
    if ! load_env; then
        return 1
    fi

    if [ -z "$POSTGRES_PASSWORD" ]; then
        log_error "POSTGRES_PASSWORD not set in .env"
        return 1
    fi

    if ! command -v psql &>/dev/null; then
        log_error "PostgreSQL is not installed. Run 'install' first."
        return 1
    fi

    log_info "Creating user: $POSTGRES_USER"
    log_info "Creating database: $POSTGRES_DB"

    # Create user and database
    sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE ${POSTGRES_DB};

-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${POSTGRES_USER}') THEN
        CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};

-- Grant schema permissions
\c ${POSTGRES_DB}
GRANT ALL ON SCHEMA public TO ${POSTGRES_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${POSTGRES_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${POSTGRES_USER};
EOF

    log_success "User and database created"
    log_info "  User: $POSTGRES_USER"
    log_info "  Database: $POSTGRES_DB"
    log_info "  Password: (from .env)"

    return 0
}

# =============================================================================
# Go Installation
# =============================================================================

install_go() {
    log_step "Checking Go installation..."

    if command -v go &>/dev/null; then
        local go_version=$(go version | awk '{print $3}')
        log_info "Go already installed: $go_version"
        return 0
    fi

    if ! confirm "Install Go 1.24?" Y; then
        log_info "Skipping Go installation"
        return 0
    fi

    log_info "Installing Go 1.24..."

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
    log_info "  You may need to restart your shell or run: source ~/.bashrc"

    return 0
}

# =============================================================================
# Goose Installation
# =============================================================================

install_goose() {
    log_step "Checking Goose installation..."

    # Ensure Go is installed
    install_go

    # Ensure PATH includes Go
    export PATH=/usr/local/go/bin:$PATH
    export PATH=$PATH:$(go env GOPATH 2>/dev/null || echo "$HOME/go")/bin

    if command -v goose &>/dev/null; then
        local goose_version=$(goose --version)
        log_info "Goose already installed: $goose_version"
        return 0
    fi

    if ! confirm "Install Goose (database migration tool)?" Y; then
        log_info "Skipping Goose installation"
        return 0
    fi

    log_info "Installing Goose..."

    # Get GOPATH
    local gopath=$(go env GOPATH 2>/dev/null || echo "$HOME/go")

    go install github.com/pressly/goose/v3/cmd/goose@latest

    # Ensure GOPATH/bin is in PATH
    export PATH=$PATH:${gopath}/bin

    # Add to shell profile
    if ! grep -q "${gopath}/bin" ~/.bashrc 2>/dev/null; then
        echo "export PATH=\$PATH:${gopath}/bin" >>~/.bashrc
    fi

    log_success "Goose installed successfully"
    log_info "  You may need to restart your shell or run: source ~/.bashrc"

    return 0
}

# =============================================================================
# Database Migrations
# =============================================================================

run_migrations() {
    log_step "Running database migrations..."

    # Load environment
    if ! load_env; then
        return 1
    fi

    # Install goose if needed
    install_goose

    # Ensure PATH includes goose
    local gopath=$(go env GOPATH 2>/dev/null || echo "$HOME/go")
    export PATH=/usr/local/go/bin:$PATH
    export PATH=$PATH:${gopath}/bin

    # Check migrations directory
    if [ ! -d "$MIGRATIONS_DIR" ]; then
        log_error "Migrations directory not found: $MIGRATIONS_DIR"
        return 1
    fi

    # Check for migrations
    local migration_count=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | wc -l)
    if [ "$migration_count" -eq 0 ]; then
        log_warn "No migration files found in $MIGRATIONS_DIR"
        return 0
    fi

    log_info "Found $migration_count migration files"

    if ! confirm "Run database migrations?" Y; then
        log_info "Skipping migrations"
        return 0
    fi

    # Build connection URL if DATABASE_URL is not set
    local conn_url="$DATABASE_URL"

    if [ -z "$conn_url" ]; then
        log_info "Building connection URL from individual variables..."
        conn_url="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?sslmode=disable"
    fi

    log_info "Running migrations..."
    goose -dir "$MIGRATIONS_DIR" postgres "$conn_url" up

    log_success "Migrations completed"
    log_info "  Applied $migration_count migrations"

    return 0
}

# =============================================================================
# Service Management
# =============================================================================

service_ctl() {
    local action="$1"

    if ! command -v systemctl &>/dev/null; then
        log_error "systemctl not found. This script requires systemd."
        return 1
    fi

    log_step "PostgreSQL service: $action"

    case "$action" in
        start)
            systemctl start postgresql
            sleep 2
            if systemctl is-active --quiet postgresql; then
                log_success "PostgreSQL started"
            else
                log_error "PostgreSQL failed to start"
                systemctl status postgresql --no-pager
                return 1
            fi
            ;;
        stop)
            systemctl stop postgresql
            log_success "PostgreSQL stopped"
            ;;
        restart)
            systemctl restart postgresql
            sleep 2
            if systemctl is-active --quiet postgresql; then
                log_success "PostgreSQL restarted"
            else
                log_error "PostgreSQL failed to restart"
                systemctl status postgresql --no-pager
                return 1
            fi
            ;;
        status)
            systemctl status postgresql --no-pager
            ;;
        enable)
            systemctl enable postgresql
            log_success "PostgreSQL enabled for auto-start"
            ;;
        disable)
            systemctl disable postgresql
            log_success "PostgreSQL disabled for auto-start"
            ;;
        *)
            log_error "Unknown action: $action"
            return 1
            ;;
    esac

    return 0
}

# =============================================================================
# Database Shell
# =============================================================================

db_shell() {
    log_step "Connecting to database shell..."

    # Load environment
    if ! load_env; then
        return 1
    fi

    if ! command -v psql &>/dev/null; then
        log_error "psql not found. Install PostgreSQL first."
        return 1
    fi

    log_info "Connecting to $POSTGRES_DB as $POSTGRES_USER..."
    log_info "Type \\q to exit"

    sudo -u postgres psql -d "$POSTGRES_DB" -U "$POSTGRES_USER" -h localhost
}

# =============================================================================
# Full Setup
# =============================================================================

run_all() {
    log_step "Running full PostgreSQL setup..."

    # Check sudo
    check_sudo

    # Install PostgreSQL
    install_postgres

    # Start PostgreSQL service
    service_ctl start

    # Configure PostgreSQL
    configure_pg

    # Restart to apply configuration
    service_ctl restart

    # Setup user and database
    setup_user

    # Run migrations
    run_migrations

    log_success "========================================"
    log_success "  PostgreSQL setup complete!"
    log_success "========================================"
    log_info ""
    log_info "To connect to the database shell:"
    log_info "  sudo ./setup-postgres-local.sh shell"
    log_info ""
    log_info "To start/stop PostgreSQL:"
    log_info "  sudo ./setup-postgres-local.sh start"
    log_info "  sudo ./setup-postgres-local.sh stop"
    log_info ""
    log_info "To run migrations:"
    log_info "  sudo ./setup-postgres-local.sh migrate"
}

# =============================================================================
# Help
# =============================================================================

show_help() {
    echo "CV-Gen PostgreSQL Local Development Setup"
    echo ""
    echo "Usage: sudo ./setup-postgres-local.sh [command]"
    echo ""
    echo "Commands:"
    echo "  all         Run full setup (install, configure, user, migrate)"
    echo "  install     Install PostgreSQL from official APT repository"
    echo "  configure   Configure PostgreSQL (listen on *, password auth)"
    echo "  user        Create user and database from .env"
    echo "  migrate     Run database migrations with goose"
    echo "  start       Start PostgreSQL service"
    echo "  stop        Stop PostgreSQL service"
    echo "  restart     Restart PostgreSQL service"
    echo "  status      Check service status"
    echo "  enable      Enable auto-start on boot"
    echo "  disable     Disable auto-start on boot"
    echo "  shell       Connect to database shell"
    echo "  help        Show this help message"
    echo ""
    echo "Environment (.env):"
    echo "  POSTGRES_USER     Database user (default: cvgen)"
    echo "  POSTGRES_PASSWORD Database password"
    echo "  POSTGRES_DB       Database name (default: cvgen_db)"
    echo "  DATABASE_URL      Full connection string (optional)"
    echo ""
    echo "The script looks for .env in:"
    echo "  - Project root (parent of scripts/)"
    echo "  - Current directory"
    echo "  - ~/.cv-gen/"
}

# =============================================================================
# Main Entry Point
# =============================================================================

main() {
    local command="${1:-all}"

    echo "=============================================="
    echo "  CV-Gen PostgreSQL Local Setup"
    echo "=============================================="
    echo ""

    case "$command" in
        all)
            run_all
            ;;
        install)
            check_sudo
            install_postgres
            ;;
        configure)
            check_sudo
            configure_pg
            ;;
        user)
            check_sudo
            setup_user
            ;;
        migrate)
            check_sudo
            run_migrations
            ;;
        start)
            check_sudo
            service_ctl start
            ;;
        stop)
            check_sudo
            service_ctl stop
            ;;
        restart)
            check_sudo
            service_ctl restart
            ;;
        status)
            check_sudo
            service_ctl status
            ;;
        enable)
            check_sudo
            service_ctl enable
            ;;
        disable)
            check_sudo
            service_ctl disable
            ;;
        shell)
            check_sudo
            db_shell
            ;;
        help|--help|-h)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
