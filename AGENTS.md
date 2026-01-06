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

**Design System**: Always use the design system from `styles.json`:
```typescript
// Use design system colors via CSS variables
<div className="bg-amber text-charcoal hover:bg-amber-dark" />

// Use design system spacing
<div className="p-lg md:p-xl" />

// Use design system shadows
<div className="shadow-soft hover:shadow-medium" />

// Use design system typography components
import { Hero, H1, H2, H3, H4, Body, Small, Caption, Code } from '@/components/ui/typography'

<Hero>Page Title</Hero>
<H1>Section Title</H1>
<Body>Main content text</Body>
<Small>Helper text</Small>
```

**Reusable UI Components**: Always use reusable components from `frontend/src/components/ui/`:
```typescript
// Button variants from design system
import { Button } from '@/components/ui/button'

<Button variant="primary" size="default">Click me</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button variant="ghost" size="sm">Ghost</Button>
<Button variant="destructive" size="icon">Delete</Button>

// Card variants
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

<Card variant="default">Content</Card>
<Card variant="elevated">Elevated card</Card>
<Card variant="dark">Dark card</Card>

// Input with design system styling
import { Input, Textarea, Label } from '@/components/ui'

<Input placeholder="Enter text..." />
<Textarea rows={4} />
<Label>Field label</Label>

// Badge variants
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>

// Layout components
import { Container, Section } from '@/components/ui/container'

<Section variant="warmFade" spacing="lg">
  <Container maxWidth="xl">
    Content
  </Container>
</Section>
```

---

## Design System Guidelines

The CV-Gen Design System is defined in `styles.json`. Always reference it for styling decisions.

### Colors
Use design system colors via Tailwind CSS variables:
- **Primary**: `--color-amber` (#F5A623), `--color-amber-dark` (#E09000), `--color-amber-light` (#FFB84D)
- **Backgrounds**: `--color-warm-white` (#FFFBF5), `--color-cream` (#F5F0E8), `--color-off-white` (#FAF7F2)
- **Text**: `--color-charcoal` (#1A1A1A), `--color-mid-gray` (#6B6B6B)
- **Semantic**: `--color-success` (#4CAF50), `--color-warning` (#F5A623), `--color-error` (#FF6B4A), `--color-info` (#5B8DEF)
- **Decorative**: `--color-purple` (#8B7EC8), `--color-lavender` (#B8A9E8)

### Typography
- **Headings**: Use `Space Grotesk` font family (loaded from Google Fonts)
- **Body**: Use `DM Sans` font family
- **Code**: Use `JetBrains Mono` font family
- Use typography components for consistent scaling: `Hero`, `H1`, `H2`, `H3`, `H4`, `Body`, `Small`, `Caption`, `Code`

### Spacing
Design system spacing scale:
- `xs`: 0.25rem, `sm`: 0.5rem, `md`: 1rem, `lg`: 1.5rem, `xl`: 2rem
- `2xl`: 3rem, `3xl`: 4rem, `4xl`: 6rem, `5xl`: 8rem, `6xl`: 12rem

### Shadows
- `--shadow-subtle`: 0 2px 8px rgba(26, 26, 26, 0.04)
- `--shadow-soft`: 0 4px 16px rgba(26, 26, 26, 0.08)
- `--shadow-medium`: 0 8px 32px rgba(26, 26, 26, 0.12)
- `--shadow-elevated`: 0 16px 48px rgba(26, 26, 26, 0.16)
- `--shadow-dramatic`: 0 24px 64px rgba(26, 26, 26, 0.2)

### Borders
- `--radius-sm`: 4px, `--radius-md`: 8px, `--radius-lg`: 12px
- `--radius-xl`: 16px, `--radius-2xl`: 24px, `--radius-pill`: 9999px

### Motion
- **Easing**: `--ease-default` (cubic-bezier 0.4, 0, 0.2, 1), `--ease-bounce`, `--ease-smooth`
- **Duration**: instant (100ms), fast (200ms), normal (300ms), slow (500ms)
- **Hover effects**: scale 1.02, lift -4px, glow with amber shadow

### UI Component Library
All reusable components are in `frontend/src/components/ui/`:
- `button.tsx` - Primary, secondary, ghost, destructive variants with sizes
- `card.tsx` - Default, elevated, dark variants
- `input.tsx`, `textarea.tsx`, `label.tsx` - Form elements with amber focus ring
- `badge.tsx` - Status badges with semantic colors
- `typography.tsx` - Hero, H1-H4, Body, Small, Caption, Code components
- `container.tsx` - Responsive container with max-width
- `section.tsx` - Section wrapper with spacing variants

### When Creating New Components
1. Check if a reusable component exists in `frontend/src/components/ui/`
2. Use CVA (class-variance-authority) for component variants
3. Follow design system tokens from `styles.json`
4. Export from `frontend/src/components/ui/` for reuse
5. Use `cn()` utility for conditional classes

### CSS Utility Classes Available
- `.text-gradient` - Amber to coral gradient text
- `.bg-warm-fade` - Warm white fade gradient
- `.bg-accent-glow` - Amber radial glow effect
- `.bg-dark-section` - Dark gradient for sections
- `.text-highlight` - Amber text highlight underline

### Known Tailwind CSS v4 Pitfalls

#### Avoid Nested max-width Constraints with Grid/Flexbox

**Problem**: Combining nested `max-w-*` utility classes with the `Container` component (which uses inline `style={{ maxWidth }}`) can cause layout bugs, especially with CSS Grid.

**Why it happens**: 
- The `Container` component already applies `maxWidth` via inline styles
- Adding `max-w-*` classes on child elements creates conflicting width constraints
- CSS Grid calculates column widths based on parent container width
- With Tailwind CSS v4's CSS architecture, these nested constraints can cause grid items to overlap or collapse unpredictably

**Bad example**:
```tsx
<Container maxWidth="lg">  {/* Already constrains width to 1024px */}
  <div className="max-w-3xl mx-auto">  {/* AVOID: redundant nested constraint */}
    <div className="grid grid-cols-2 gap-6">
      {/* Grid items may overlap or break */}
    </div>
  </div>
</Container>
```

**Good example**:
```tsx
<Container maxWidth="lg">
  <div className="mx-auto" style={{ maxWidth: '768px' }}>  {/* OK if needed */}
    <div className="grid grid-cols-2 gap-6">
      {/* Grid works correctly */}
    </div>
  </div>
</Container>

{/* Or better - just use Container's maxWidth prop */}
<Container maxWidth="md">  {/* Use appropriate size directly */}
  <div className="grid grid-cols-2 gap-6">
    {/* Grid works correctly */}
  </div>
</Container>
```

**Best practices**:
1. Use `Container`'s `maxWidth` prop instead of adding `max-w-*` classes inside
2. If you need nested width constraints, use inline styles or a wrapper `<div>` without Tailwind's `max-w-*` classes
3. For grid layouts, ensure there's only ONE clear max-width constraint in the parent chain
4. Prefer vertical stacking (`space-y-*`) over grid for simple option cards to avoid complexity

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
