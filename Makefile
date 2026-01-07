.PHONY: dev down logs build clean db-migrate db-rollback db-reset sqlc help \
	dev-up dev-down dev-logs dev-status dev-shell \
	staging-up staging-down staging-logs staging-status staging-logs-backend staging-logs-caddy \
	staging-shell-backend staging-db-shell \
	staging-deploy staging-restart staging-rebuild \
	prod-up prod-down prod-logs prod-status prod-logs-backend prod-logs-caddy \
	prod-shell-backend prod-db-shell \
	prod-restart prod-rebuild prod-deploy prod-migrate

.DEFAULT_GOAL := help

# ================================
# Development
# ================================

## Start all services in development mode
dev:
	docker compose up --build

## Start all services in background
dev-detach:
	docker compose up --build -d

## Stop all services
down:
	docker compose down

## View logs from all services
logs:
	docker compose logs -f

## View logs from specific service (usage: make logs-service SERVICE=backend)
logs-service:
	docker compose logs -f $(SERVICE)

## Restart a specific service (usage: make restart SERVICE=backend)
restart:
	docker compose restart $(SERVICE)

# ================================
# Database
# ================================

## Run database migrations
db-migrate:
	docker compose exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" up

## Rollback last migration
db-rollback:
	docker compose exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" down

## Check migration status
db-status:
	docker compose exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" status

## Reset database (drop all tables and re-run migrations)
db-reset:
	docker compose exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" reset
	docker compose exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" up

## Connect to database via psql
db-shell:
	docker compose exec db psql -U cvgen -d cvgen_db

# ================================
# Code Generation
# ================================

## Generate SQLC code
sqlc:
	docker compose exec backend sqlc generate

# ================================
# Build
# ================================

## Build production images
build:
	docker compose -f docker-compose.yml build --target prod

## Build backend only
build-backend:
	docker compose build backend

## Build frontend only
build-frontend:
	docker compose build frontend

# ================================
# Cleanup
# ================================

## Remove all containers, volumes, and images
clean:
	docker compose down -v --rmi local --remove-orphans

## Remove only volumes (keeps images)
clean-volumes:
	docker compose down -v

# ================================
# Utilities
# ================================

## Open shell in backend container
shell-backend:
	docker compose exec backend sh

## Open shell in frontend container
shell-frontend:
	docker compose exec frontend sh

## Check service status
status:
	docker compose ps

## Install frontend dependencies (after adding new packages)
frontend-install:
	docker compose exec frontend bun install

# ================================
# Deploy - Development
# ================================

## Start development environment (from deploy/dev)
dev-up:
	cd deploy/dev && docker compose --env-file ../../.env up --build -d

## Stop development environment
dev-down:
	cd deploy/dev && docker compose --env-file ../../.env down

## View development logs
dev-logs:
	cd deploy/dev && docker compose --env-file ../../.env logs -f

## Check development status
dev-status:
	cd deploy/dev && docker compose --env-file ../../.env ps

## Open shell in development backend
dev-shell-backend:
	cd deploy/dev && docker compose --env-file ../../.env exec backend sh

## Open shell in development frontend
dev-shell-frontend:
	cd deploy/dev && docker compose --env-file ../../.env exec frontend sh

# ================================
# Deploy - Staging
# ================================

## Start staging environment (from deploy/staging)
staging-up:
	cd deploy/staging && docker compose --env-file ../../.env up --build -d

## Stop staging environment
staging-down:
	cd deploy/staging && docker compose --env-file ../../.env down

## View staging logs
staging-logs:
	cd deploy/staging && docker compose --env-file ../../.env logs -f

## Check staging status
staging-status:
	cd deploy/staging && docker compose --env-file ../../.env ps

## View staging backend logs
staging-logs-backend:
	cd deploy/staging && docker compose --env-file ../../.env logs -f backend

## View staging caddy logs
staging-logs-caddy:
	cd deploy/staging && docker compose --env-file ../../.env logs -f caddy

## Open shell in staging backend
staging-shell-backend:
	cd deploy/staging && docker compose --env-file ../../.env exec backend sh

## Connect to staging database
staging-db-shell:
	cd deploy/staging && docker compose --env-file ../../.env exec db psql -U cvgen -d cvgen_staging_db

## Restart staging service (usage: make staging-restart SERVICE=backend)
staging-restart:
	cd deploy/staging && docker compose --env-file ../../.env restart $(SERVICE)

## Rebuild and restart staging (usage: make staging-rebuild SERVICE=backend)
staging-rebuild:
	cd deploy/staging && docker compose --env-file ../../.env build $(SERVICE) && docker compose --env-file ../../.env up -d $(SERVICE)

## Deploy staging (rebuild and restart all services)
staging-deploy:
	cd deploy/staging && docker compose --env-file ../../.env down && docker compose --env-file ../../.env up --build -d

# ================================
# Deploy - Production
# ================================
# ⚠️  WARNING: Production deployment!
#    Ensure DNS is configured and .env is populated with real values first.

## Start production environment (from deploy/prod)
prod-up:
	@echo "⚠️  Starting production environment..."
	@echo "⚠️  Ensure DNS for cv.aidityas.me points to this server!"
	cd deploy/prod && docker compose --env-file ../../.env up --build -d

## Stop production environment
prod-down:
	@echo "⚠️  Stopping production environment..."
	cd deploy/prod && docker compose --env-file ../../.env down

## View production logs
prod-logs:
	cd deploy/prod && docker compose --env-file ../../.env logs -f

## Check production status
prod-status:
	cd deploy/prod && docker compose --env-file ../../.env ps

## View production backend logs
prod-logs-backend:
	cd deploy/prod && docker compose --env-file ../../.env logs -f backend

## View production caddy logs
prod-logs-caddy:
	cd deploy/prod && docker compose --env-file ../../.env logs -f caddy

## Open shell in production backend
prod-shell-backend:
	cd deploy/prod && docker compose --env-file ../../.env exec backend sh

## Connect to production database
prod-db-shell:
	cd deploy/prod && docker compose --env-file ../../.env exec db psql -U cvgen -d cvgen_prod_db

## Restart production service (usage: make prod-restart SERVICE=backend)
prod-restart:
	cd deploy/prod && docker compose --env-file ../../.env restart $(SERVICE)

## Rebuild and restart production (usage: make prod-rebuild SERVICE=backend)
prod-rebuild:
	cd deploy/prod && docker compose --env-file ../../.env build $(SERVICE) && docker compose --env-file ../../.env up -d $(SERVICE)

## Full production deployment (down + up --build)
prod-deploy:
	@echo "⚠️  Starting full production deployment..."
	@echo "⚠️  This will restart all services!"
	cd deploy/prod && docker compose --env-file ../../.env down && docker compose --env-file ../../.env up --build -d

## Run production database migrations
prod-migrate:
	cd deploy/prod && docker compose --env-file ../../.env exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" up

# ================================
# Help
# ================================

## Show this help message
help:
	@echo "CV-Gen Monorepo - Available Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@awk '/^## / {desc=$$0; sub(/^## /,"",desc)} /^[a-zA-Z_-]+:/ && desc {printf "  \033[36m%-20s\033[0m %s\n", substr($$1,1,length($$1)-1), desc; desc=""}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Environment Quick Start:"
	@echo "  make dev              # Local development (root compose)"
	@echo "  make dev-up           # deploy/dev environment"
	@echo "  make staging-up       # deploy/staging environment"
	@echo "  make prod-up          # deploy/prod environment (PRODUCTION!)"
