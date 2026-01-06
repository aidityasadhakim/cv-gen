.PHONY: dev down logs build clean db-migrate db-rollback db-reset sqlc help

# Default target
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

# ================================
# Help
# ================================

## Show this help message
help:
	@echo "CV-Gen Monorepo - Available Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Examples:"
	@echo "  make dev              # Start development environment"
	@echo "  make logs             # View all logs"
	@echo "  make db-migrate       # Run database migrations"
	@echo "  make sqlc             # Generate SQLC code"
