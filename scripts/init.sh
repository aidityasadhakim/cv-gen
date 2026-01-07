#!/bin/bash
#
# CV-Gen Server Initialization Script
# Usage: ./init.sh [dev|staging|prod]
#
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-dev}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$PROJECT_DIR/deploy/$ENVIRONMENT"
ENV_FILE="$PROJECT_DIR/.env"

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

check_prerequisites() {
  log_info "Checking prerequisites..."

  local missing=()

  # Check Docker
  if ! command -v docker &>/dev/null; then
    missing+=("docker")
  else
    docker --version
  fi

  # Check Docker Compose
  if ! command -v docker compose &>/dev/null; then
    missing+=("docker compose")
  else
    docker compose version
  fi

  # Check Git
  if ! command -v git &>/dev/null; then
    missing+=("git")
  else
    git --version
  fi

  if [ ${#missing[@]} -ne 0 ]; then
    log_error "Missing prerequisites: ${missing[*]}"
    echo "Please install the missing tools and try again."
    exit 1
  fi

  log_success "All prerequisites satisfied"
}

install_go() {
  if command -v go &>/dev/null; then
    log_info "Go already installed: $(go version)"
    return
  fi

  log_info "Installing Go..."

  # Detect architecture
  local arch=$(uname -m)
  local amd64="x86_64"
  local arm64="aarch64"

  if [ "$arch" = "x86_64" ]; then
    arch="amd64"
  elif [ "$arch" = "aarch64" ]; then
    arch="arm64"
  fi

  local go_version="1.24.0"
  local go_archive="go${go_version}.linux-${arch}.tar.gz"

  # Download and install
  cd /tmp
  wget -q "https://go.dev/dl/${go_archive}" -O "$go_archive"
  sudo rm -rf /usr/local/go
  sudo tar -C /usr/local -xzf "$go_archive"
  rm "$go_archive"

  # Add to PATH for this session
  export PATH=$PATH:/usr/local/go/bin

  # Add to shell profile
  if ! grep -q "/usr/local/go/bin" ~/.bashrc 2>/dev/null; then
    echo 'export PATH=$PATH:/usr/local/go/bin' >>~/.bashrc
  fi

  log_success "Go ${go_version} installed successfully"
}

install_goose() {
  if command -v goose &>/dev/null; then
    log_info "Goose already installed: $(goose --version)"
    return
  fi

  log_info "Installing Goose (database migration tool)..."
  go install github.com/presslabs/goose@latest

  # Ensure GOPATH/bin is in PATH
  local gopath="${GOPATH:-$HOME/go}"
  export PATH=$PATH:$gopath/bin

  if ! grep -q "$gopath/bin" ~/.bashrc 2>/dev/null; then
    echo "export PATH=\$PATH:$gopath/bin" >>~/.bashrc
  fi

  log_success "Goose installed successfully"
}

install_bun() {
  if command -v bun &>/dev/null; then
    log_info "Bun already installed: $(bun --version)"
    return
  fi

  log_info "Installing Bun..."

  # Install Bun
  curl -fsSL https://bun.sh/install | bash

  # Add to PATH for this session
  export PATH=$PATH:$HOME/.bun/bin

  if ! grep -q ".bun/bin" ~/.bashrc 2>/dev/null; then
    echo 'export PATH=$PATH:$HOME/.bun/bin' >>~/.bashrc
  fi

  log_success "Bun installed successfully"
}

check_env_file() {
  log_info "Checking environment file..."

  if [ ! -f "$ENV_FILE" ]; then
    log_warn "Environment file not found: $ENV_FILE"
    log_info "Creating template from .env.example..."

    if [ -f "$PROJECT_DIR/.env.example" ]; then
      cp "$PROJECT_DIR/.env.example" "$ENV_FILE"
      log_warn "Please edit $ENV_FILE with your actual values"
      exit 1
    else
      log_error "No .env.example found in $PROJECT_DIR"
      exit 1
    fi
  fi

  # Verify critical environment variables
  log_info "Verifying environment variables..."

  # Source the env file to check variables
  set -a
  source "$ENV_FILE"
  set +a

  local missing_vars=()

  # Check critical variables based on environment
  case "$ENVIRONMENT" in
  prod)
    if [ -z "$DATABASE_URL" ]; then
      missing_vars+=("DATABASE_URL")
    fi
    if [ -z "$CLERK_SECRET_KEY" ]; then
      missing_vars+=("CLERK_SECRET_KEY")
    fi
    ;;
  staging)
    if [ -z "$DATABASE_URL" ]; then
      missing_vars+=("DATABASE_URL")
    fi
    ;;
  esac

  if [ ${#missing_vars[@]} -ne 0 ]; then
    log_error "Missing required environment variables: ${missing_vars[*]}"
    log_info "Please update $ENV_FILE and try again"
    exit 1
  fi

  log_success "Environment file verified"
}

pull_latest_code() {
  log_info "Checking for updates..."

  if [ -d "$PROJECT_DIR/.git" ]; then
    cd "$PROJECT_DIR"
    git fetch origin
    local local_commit=$(git rev-parse HEAD)
    local remote_commit=$(git rev-parse origin/$(git rev-parse --abbrev-ref HEAD))

    if [ "$local_commit" != "$remote_commit" ]; then
      log_warn "Local commit differs from remote"
      read -p "Pull latest changes? [y/N] " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        git pull
      fi
    else
      log_info "Already at latest commit"
    fi
  fi
}

build_frontend() {
  log_info "Building frontend for $ENVIRONMENT..."

  local frontend_dir="$PROJECT_DIR/frontend"

  if [ ! -d "$frontend_dir" ]; then
    log_error "Frontend directory not found: $frontend_dir"
    exit 1
  fi

  cd "$frontend_dir"

  # Install dependencies if needed
  if [ ! -d "node_modules" ] && [ ! -d "$HOME/.bun/install/cache" ]; then
    log_info "Installing frontend dependencies..."
    bun install
  fi

  log_info "Building frontend..."
  bun run build

  if [ ! -d "dist" ]; then
    log_error "Frontend build failed - dist directory not found"
    exit 1
  fi

  log_success "Frontend built successfully"
}

run_migrations() {
  log_info "Running database migrations..."

  local migrations_dir="$PROJECT_DIR/backend/sql/migrations"

  if [ ! -d "$migrations_dir" ]; then
    log_error "Migrations directory not found: $migrations_dir"
    exit 1
  fi

  # Ensure goose is in PATH
  local gopath="${GOPATH:-$HOME/go}"
  export PATH=$PATH:$gopath/bin

  # Source env file
  set -a
  source "$ENV_FILE"
  set +a

  # Run migrations
  if [ -n "$DATABASE_URL" ]; then
    goose -dir "$migrations_dir" postgres "$DATABASE_URL" up
    log_success "Migrations completed"
  else
    log_warn "DATABASE_URL not set - skipping migrations"
    log_info "Migrations will run when the container starts"
  fi
}

start_services() {
  log_info "Starting $ENVIRONMENT services..."

  cd "$DEPLOY_DIR"

  # Pull latest images first
  log_info "Pulling latest Docker images..."
  docker compose pull

  # Build and start services
  log_info "Building and starting services..."
  docker compose up --build -d

  # Wait for services to be healthy
  log_info "Waiting for services to be healthy..."
  local max_attempts=60
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    local db_status=$(docker compose ps -q db 2>/dev/null | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "not_found")
    local backend_status=$(docker compose ps -q backend 2>/dev/null | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "not_found")

    if [ "$db_status" = "healthy" ]; then
      log_success "Database is healthy"
      break
    fi

    attempt=$((attempt + 1))
    sleep 2
  done

  if [ $attempt -eq $max_attempts ]; then
    log_warn "Database did not become healthy in time"
  fi

  log_success "Services started successfully"
}

verify_deployment() {
  log_info "Verifying deployment..."

  cd "$DEPLOY_DIR"

  # Check service status
  docker compose ps

  # Show logs for quick verification
  echo ""
  log_info "Recent logs (last 10 lines):"
  docker compose logs --tail=10

  echo ""
  log_success "Deployment complete!"
  log_info "Environment: $ENVIRONMENT"
  log_info "To view logs: cd $DEPLOY_DIR && docker compose logs -f"
  log_info "To stop: cd $DEPLOY_DIR && docker compose down"
}

show_help() {
  echo "CV-Gen Server Initialization Script"
  echo ""
  echo "Usage: $0 [environment]"
  echo ""
  echo "Environments:"
  echo "  dev       - Local development with hot-reload (default)"
  echo "  staging   - Staging environment for testing"
  echo "  prod      - Production environment"
  echo ""
  echo "Prerequisites:"
  echo "  - Docker & Docker Compose"
  echo "  - Git"
  echo ""
  echo "The script will:"
  echo "  1. Check prerequisites"
  echo "  2. Install Go, Goose, and Bun (if needed)"
  echo "  3. Verify/update .env file"
  echo "  4. Build frontend"
  echo "  5. Run database migrations"
  echo "  6. Start all services"
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
  echo "=============================================="
  echo "  CV-Gen Server Initialization"
  echo "  Environment: $ENVIRONMENT"
  echo "=============================================="
  echo ""

  case "$ENVIRONMENT" in
  -h | --help | help)
    show_help
    exit 0
    ;;
  dev | staging | prod)
    # Valid environments
    ;;
  *)
    log_error "Unknown environment: $ENVIRONMENT"
    echo "Use: $0 [dev|staging|prod]"
    exit 1
    ;;
  esac

  check_prerequisites
  install_go
  install_goose

  if [ "$ENVIRONMENT" != "dev" ]; then
    install_bun
  fi

  check_env_file

  if [ "$ENVIRONMENT" != "dev" ]; then
    build_frontend
    run_migrations
  fi

  start_services
  verify_deployment
}

main "$@"
