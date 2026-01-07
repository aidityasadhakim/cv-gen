.PHONY: help dev dev-detach down logs logs-service restart status \
	db-migrate db-rollback db-status db-reset db-shell \
	sqlc clean clean-volumes shell-frontend frontend-install \
	dev-up dev-down dev-logs dev-status dev-shell \
	staging-up staging-down staging-logs staging-status staging-shell-backend staging-db-shell \
	staging-deploy staging-restart staging-rebuild staging-migrate \
	prod-up prod-down prod-logs prod-status prod-shell-backend prod-db-shell \
	prod-restart prod-rebuild prod-deploy prod-migrate \
	frontend-build

.DEFAULT_GOAL := help

# ================================
# Local Development (Root Compose)
# ================================

## Start development with hot-reload
dev:
	docker compose up --build

## Start development in background
dev-detach:
	docker compose up --build -d

## Stop all services
down:
	docker compose down

## View all logs
logs:
	docker compose logs -f

## View specific service logs (usage: make logs-service SERVICE=backend)
logs-service:
	docker compose logs -f $(SERVICE)

## Restart service (usage: make restart SERVICE=backend)
restart:
	docker compose restart $(SERVICE)

## Check service status
status:
	docker compose ps

# ================================
# Database (Local Development)
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
# Cleanup
# ================================

## Remove all containers, volumes, and images
clean:
	docker compose down -v --rmi local --remove-orphans

## Remove only volumes (keeps images)
clean-volumes:
	docker compose down -v

## Install frontend dependencies
frontend-install:
	docker compose exec frontend bun install

# ================================
# Deploy - Development
# ================================

## Start development environment
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

# ================================
# Deploy - Staging
# ================================

## Start staging environment
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

## Open shell in staging backend
staging-shell-backend:
	cd deploy/staging && docker compose --env-file ../../.env exec backend sh

## Connect to staging database
staging-db-shell:
	cd deploy/staging && docker compose --env-file ../../.env exec db psql -U cvgen -d cvgen_staging_db

## Restart staging service (usage: make staging-restart SERVICE=backend)
staging-restart:
	cd deploy/staging && docker compose --env-file ../../.env restart $(SERVICE)

## Rebuild and restart staging service (usage: make staging-rebuild SERVICE=backend)
staging-rebuild:
	cd deploy/staging && docker compose --env-file ../../.env build $(SERVICE) && docker compose --env-file ../../.env up -d $(SERVICE)

## Full staging deployment
staging-deploy:
	cd deploy/staging && docker compose --env-file ../../.env down && docker compose --env-file ../../.env up --build -d

## Run staging database migrations
staging-migrate:
	cd deploy/staging && docker compose --env-file ../../.env exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" up

# ================================
# Deploy - Production
# ================================

## Start production environment
prod-up:
	@echo "⚠️  Starting production..."
	@echo "⚠️  Ensure DNS is configured!"
	cd deploy/prod && docker compose --env-file ../../.env up --build -d

## Stop production environment
prod-down:
	@echo "⚠️  Stopping production..."
	cd deploy/prod && docker compose --env-file ../../.env down

## View production logs
prod-logs:
	cd deploy/prod && docker compose --env-file ../../.env logs -f

## Check production status
prod-status:
	cd deploy/prod && docker compose --env-file ../../.env ps

## Open shell in production backend
prod-shell-backend:
	cd deploy/prod && docker compose --env-file ../../.env exec backend sh

## Connect to production database
prod-db-shell:
	cd deploy/prod && docker compose --env-file ../../.env exec db psql -U cvgen -d cvgen_prod_db

## Restart production service (usage: make prod-restart SERVICE=backend)
prod-restart:
	cd deploy/prod && docker compose --env-file ../../.env restart $(SERVICE)

## Rebuild and restart production service (usage: make prod-rebuild SERVICE=backend)
prod-rebuild:
	cd deploy/prod && docker compose --env-file ../../.env build $(SERVICE) && docker compose --env-file ../../.env up -d $(SERVICE)

## Full production deployment
prod-deploy:
	@echo "⚠️  Full production deployment..."
	@echo "⚠️  This restarts all services!"
	cd deploy/prod && docker compose --env-file ../../.env down && docker compose --env-file ../../.env up --build -d

## Run production database migrations
prod-migrate:
	cd deploy/prod && docker compose --env-file ../../.env exec backend goose -dir ./sql/migrations postgres "$$DATABASE_URL" up

# ================================
# Frontend Build
# ================================

## Build frontend static files (for Caddy)
frontend-build:
	@echo "Building frontend..."
	cd frontend && bun install && bun run build
	@echo "Frontend built successfully!"
	@echo "Files are in frontend/dist/ (mounted by Caddy)"

# ================================
# Help
# ================================

help:
	@echo "CV-Gen - Available Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@awk '/^## / {desc=$$0; sub(/^## /,"",desc)} /^[a-zA-Z_-]+:/ && desc {printf "  \033[36m%-20s\033[0m %s\n", substr($$1,1,length($$1)-1), desc; desc=""}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Quick Start:"
	@echo "  make dev              # Local development (root compose)"
	@echo "  make dev-up           # deploy/dev environment"
	@echo "  make staging-up       # deploy/staging environment"
	@echo "  make prod-up          # deploy/prod environment (PRODUCTION!)"
	@echo "  make frontend-build   # Build frontend static files"
