# AGENTS.md - Coding Agent Guidelines for CV-Gen

This document provides guidelines for AI coding agents working in this monorepo.

## Project Overview

CV-Gen is a full-stack monorepo with:
- **Backend**: Go 1.24 + Echo v4 + PostgreSQL + SQLC + Goose
- **Frontend**: React 19 + TypeScript + Vite + TanStack Router/Query + Tailwind CSS v4
- **Infrastructure**: Docker Compose for local development

## Repository Structure

```
cv-gen/
├── backend/           # Go API server
│   ├── cmd/server/    # Application entry point
│   ├── internal/      # Private application code (db, handlers, models)
│   └── sql/           # Migrations and SQLC queries
├── frontend/          # React application
│   └── src/
│       ├── components/
│       ├── routes/    # TanStack Router file-based routes
│       ├── integrations/
│       └── lib/
└── docker-compose.yml
```

---

## Build/Lint/Test Commands

### Full Stack (Docker)

```bash
make dev              # Start all services (db, backend, frontend)
make down             # Stop all services
make logs             # View logs from all services
make status           # Check service status
```

### Backend (Go)

```bash
# From repository root (via Docker)
make shell-backend                    # Enter backend container
docker compose exec backend go build ./...   # Build all packages
docker compose exec backend go test ./...    # Run all tests
docker compose exec backend go test -v ./internal/handlers/...  # Single package
docker compose exec backend go test -v -run TestHealthHandler ./internal/handlers  # Single test

# Local development (from backend/)
cd backend
go build ./...                        # Build
go test ./...                         # All tests
go test -v ./internal/handlers/...    # Single package
go test -v -run TestFunctionName ./path/to/package  # Single test
go vet ./...                          # Lint
```

### Frontend (TypeScript/React)

```bash
# From repository root (via Docker)
make shell-frontend                   # Enter frontend container

# Local development (from frontend/)
cd frontend
bun run dev                           # Start dev server
bun run build                         # Production build
bun run test                          # Run all tests
bun run test -- path/to/file.test.ts  # Single test file
bun run test -- -t "test name"        # Single test by name
bun run lint                          # ESLint
bun run format                        # Prettier
bun run check                         # Format + lint fix
```

### Database

```bash
make db-migrate       # Run migrations
make db-rollback      # Rollback last migration
make db-status        # Check migration status
make db-shell         # Connect to PostgreSQL
make sqlc             # Generate SQLC code
```

---

## Code Style Guidelines

### Go (Backend)

**Imports**: Group imports in this order, separated by blank lines:
1. Standard library
2. External packages
3. Internal packages

```go
import (
    "context"
    "net/http"

    "github.com/labstack/echo/v4"

    "cv-gen/backend/internal/db"
)
```

**Formatting**: Use `gofmt` (automatic). No configuration needed.

**Naming**:
- Use `camelCase` for unexported, `PascalCase` for exported
- Handlers: `nameHandler` (e.g., `healthHandler`, `createUserHandler`)
- Interfaces: verb-noun (e.g., `UserStore`, `CVRepository`)
- Files: `snake_case.go`

**Error Handling**:
```go
// Always check errors explicitly
if err != nil {
    return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
}

// Use echo's error handling
return c.JSON(http.StatusOK, result)
```

**Handlers**: Return JSON with appropriate HTTP status codes:
```go
func exampleHandler(c echo.Context) error {
    return c.JSON(http.StatusOK, map[string]string{
        "message": "success",
    })
}
```

### TypeScript/React (Frontend)

**Formatting** (Prettier config):
- No semicolons
- Single quotes
- Trailing commas

**Imports**: Order (enforced by ESLint):
1. React/external libraries
2. Internal components/hooks
3. Types (use `import type`)

```typescript
import { createFileRoute } from '@tanstack/react-router'

import Header from '../components/Header'

import type { QueryClient } from '@tanstack/react-query'
```

**Naming**:
- Components: `PascalCase` (files and functions)
- Hooks: `useCamelCase`
- Utilities: `camelCase`
- Types/Interfaces: `PascalCase`
- Routes: kebab-case folders, index.tsx files

**Types**: Use TypeScript strictly:
- Enable `strict: true` in tsconfig
- Avoid `any` - use `unknown` if type is uncertain
- Define interfaces for API responses
- Use `type` for unions/intersections, `interface` for objects

```typescript
interface User {
  id: string
  email: string
  name: string
}

type ApiResponse<T> = { data: T } | { error: string }
```

**Components**: Use functional components with hooks:
```typescript
export function MyComponent({ title }: { title: string }) {
  const [state, setState] = useState(false)
  return <div>{title}</div>
}
```

**Styling**: Use Tailwind CSS with `cn()` utility for conditional classes:
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

---

## File Patterns

### Backend
- Entry point: `backend/cmd/server/main.go`
- Handlers: `backend/internal/handlers/*.go`
- Database: `backend/internal/db/*.go`
- Models: `backend/internal/models/*.go`
- Migrations: `backend/sql/migrations/*.sql` (Goose format)
- Queries: `backend/sql/queries/*.sql` (SQLC format)

### Frontend
- Entry point: `frontend/src/main.tsx`
- Routes: `frontend/src/routes/**/*.tsx` (TanStack Router file-based)
- Components: `frontend/src/components/*.tsx`
- Utilities: `frontend/src/lib/*.ts`

---

## Database Guidelines

### Migrations (Goose)
```sql
-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- +goose Down
DROP TABLE IF EXISTS users;
```

### Queries (SQLC)
```sql
-- name: GetUser :one
SELECT * FROM users WHERE id = $1 LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users ORDER BY created_at DESC;

-- name: CreateUser :one
INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *;
```

---

## API Conventions

- All API routes prefixed with `/api/`
- Use JSON for request/response bodies
- HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Return appropriate status codes (200, 201, 400, 404, 500)

---

## Environment Variables

Copy `.env.example` to `.env` before development. Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `BACKEND_PORT`: API server port (default: 8080)
- `VITE_API_URL`: Backend URL for frontend (default: http://localhost:8080)
