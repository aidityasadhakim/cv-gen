# CV-Gen Monorepo Implementation Plan

## Status: COMPLETED

All initial setup tasks have been implemented successfully.

---

## Final Project Structure

```
cv-gen/
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go           # Echo HTTP server with health/hello endpoints
│   ├── internal/
│   │   ├── db/
│   │   │   └── db.go             # Database package placeholder
│   │   ├── handlers/
│   │   │   └── handlers.go       # HTTP handlers placeholder
│   │   └── models/
│   │       └── models.go         # Data models placeholder
│   ├── sql/
│   │   ├── migrations/
│   │   │   └── 00001_init.sql    # Goose migration placeholder
│   │   └── queries/
│   │       └── queries.sql       # SQLC queries placeholder
│   ├── .air.toml                 # Air hot-reload config
│   ├── Dockerfile                # Multi-stage (dev/build/prod)
│   ├── go.mod
│   ├── go.sum
│   └── sqlc.yaml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── integrations/
│   │   │   └── tanstack-query/   # TanStack Query setup
│   │   ├── lib/
│   │   ├── routes/               # TanStack Router file-based routes
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── Dockerfile                # Multi-stage (dev/build/prod)
│   ├── nginx.conf                # Nginx config for production
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── .gitignore
├── .env.example
├── Makefile
└── IMPLEMENTATION_PLAN.md
```

---

## Technology Stack (Final)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + TypeScript + Vite 7 | UI |
| Frontend Router | TanStack Router | File-based routing |
| Frontend State | TanStack Query | Server state management |
| Frontend Styling | Tailwind CSS v4 | Styling |
| Backend | Go 1.24 + Echo v4 | API Server |
| Database | PostgreSQL 16 | Data persistence |
| Migrations | Goose | Schema versioning |
| Query Gen | SQLC | Type-safe SQL queries |
| Hot Reload | Air | Go live reload in dev |
| Orchestration | Docker Compose | Container management |
| Package Manager | Bun | Frontend dependencies |

---

## Available Commands

Run `make help` to see all available commands:

| Command | Description |
|---------|-------------|
| `make dev` | Start all services in development mode |
| `make dev-detach` | Start all services in background |
| `make down` | Stop all services |
| `make logs` | View logs from all services |
| `make logs-service SERVICE=backend` | View logs from specific service |
| `make restart SERVICE=backend` | Restart a specific service |
| `make db-migrate` | Run database migrations |
| `make db-rollback` | Rollback last migration |
| `make db-status` | Check migration status |
| `make db-reset` | Reset database |
| `make db-shell` | Connect to database via psql |
| `make sqlc` | Generate SQLC code |
| `make build` | Build production images |
| `make clean` | Remove containers, volumes, and images |
| `make shell-backend` | Open shell in backend container |
| `make shell-frontend` | Open shell in frontend container |
| `make status` | Check service status |

---

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Start development environment:**
   ```bash
   make dev
   ```

3. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

4. **Test the API:**
   ```bash
   curl http://localhost:8080/api/health
   curl http://localhost:8080/api/hello
   ```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (returns status and timestamp) |
| GET | `/api/hello` | Hello endpoint (returns greeting message) |

---

## Implementation Checklist

- [x] Create root `.gitignore`
- [x] Create `.env.example`
- [x] Fix `backend/cmd/server/main.go` with Echo HTTP server
- [x] Fix `backend/.air.toml` build path
- [x] Create `backend/internal/` structure (db, handlers, models)
- [x] Create `backend/sqlc.yaml`
- [x] Create `backend/sql/migrations/` with placeholder migration
- [x] Create `backend/sql/queries/` with placeholder queries
- [x] Create `backend/Dockerfile` (multi-stage: dev/build/prod)
- [x] Create `frontend/Dockerfile` (multi-stage: dev/build/prod)
- [x] Create `frontend/nginx.conf` for production
- [x] Create `docker-compose.yml`
- [x] Create `Makefile`

---

## Decisions Made

| Question | Decision |
|----------|----------|
| HTTP Router | Echo v4 |
| Frontend State | TanStack Query (came with template) |
| Frontend Router | TanStack Router (came with template) |
| API Client | Native fetch |
| Initial Schema | Deferred (placeholders created) |

---

## Next Steps

After the initial setup is complete, potential additions:

- [ ] Design and implement database schema
- [ ] Add authentication (JWT, sessions)
- [ ] Add Nginx reverse proxy for production
- [ ] Set up GitHub Actions CI/CD
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Configure production Docker Compose override
- [ ] Create initial Git commit
- [ ] Implement CV generation features
