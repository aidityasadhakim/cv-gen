# Phase 1A: Foundation & Authentication

**Timeline**: Week 1  
**Goal**: Set up authentication infrastructure and basic protected routes

## Overview

This phase establishes the authentication foundation using Clerk and creates the database schema for the application.

---

## Tasks

### 1A.1: Clerk Account Setup
**Priority**: P0  
**Estimated Time**: 30 minutes

#### Description
Create and configure Clerk application for CV-Gen.

#### Steps
1. Create Clerk account at https://clerk.com
2. Create new application "CV-Gen"
3. Configure authentication methods:
   - Enable Email/Password
   - Optionally enable Google OAuth
4. Note down keys:
   - `CLERK_PUBLISHABLE_KEY` (frontend)
   - `CLERK_SECRET_KEY` (backend)
5. Configure allowed redirect URLs:
   - `http://localhost:3000` (development)
   - Production URL (later)

#### Acceptance Criteria
- [ ] Clerk application created
- [ ] Environment variables documented
- [ ] Email/password authentication enabled

#### Files to Modify
- `.env.example` - Add Clerk environment variables

---

### 1A.2: Database Migrations
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create database schema for application tables.

#### Steps
1. Create migrations directory structure
2. Write migration for `master_profiles` table
3. Write migration for `user_credits` table
4. Write migration for `generated_cvs` table
5. Write migration for `cover_letters` table
6. Test migrations with `make db-migrate`

#### Acceptance Criteria
- [ ] All migrations run without errors
- [ ] Tables created with correct schema
- [ ] Indexes created for performance
- [ ] Rollback works correctly

#### Files to Create
```
backend/sql/migrations/
├── 001_create_master_profiles.sql
├── 002_create_user_credits.sql
├── 003_create_generated_cvs.sql
└── 004_create_cover_letters.sql
```

#### Schema Reference
```sql
-- 001_create_master_profiles.sql
-- +goose Up
CREATE TABLE master_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    resume_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_master_profiles_user_id ON master_profiles(user_id);

-- +goose Down
DROP TABLE IF EXISTS master_profiles;
```

---

### 1A.3: SQLC Configuration & Queries
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Configure SQLC and write initial queries for all tables.

#### Steps
1. Update `sqlc.yaml` configuration
2. Write queries for master_profiles
3. Write queries for user_credits
4. Write queries for generated_cvs
5. Write queries for cover_letters
6. Generate Go code with `make sqlc`

#### Acceptance Criteria
- [ ] SQLC generates code without errors
- [ ] All CRUD operations have queries
- [ ] Generated code compiles

#### Files to Create/Modify
```
backend/
├── sqlc.yaml
└── sql/queries/
    ├── master_profiles.sql
    ├── user_credits.sql
    ├── generated_cvs.sql
    └── cover_letters.sql
```

---

### 1A.4: Backend - Clerk Go SDK Integration
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Integrate Clerk Go SDK for JWT validation.

#### Steps
1. Add Clerk SDK dependency: `go get github.com/clerk/clerk-sdk-go/v2`
2. Create config package for environment variables
3. Create auth middleware for JWT validation
4. Add middleware to protected routes
5. Create helper to extract user ID from context

#### Acceptance Criteria
- [ ] Clerk SDK installed
- [ ] Auth middleware validates JWT tokens
- [ ] Invalid/missing tokens return 401
- [ ] User ID extractable from context in handlers

#### Files to Create
```
backend/internal/
├── config/
│   └── config.go           # Environment configuration
├── middleware/
│   └── auth.go             # Clerk auth middleware
└── handlers/
    └── handlers.go         # Update with auth middleware
```

#### Code Reference
```go
// middleware/auth.go
package middleware

import (
    "github.com/clerk/clerk-sdk-go/v2"
    "github.com/labstack/echo/v4"
)

func ClerkAuth() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            claims, ok := clerk.SessionClaimsFromContext(c.Request().Context())
            if !ok {
                return echo.NewHTTPError(401, "unauthorized")
            }
            c.Set("user_id", claims.Subject)
            return next(c)
        }
    }
}

func GetUserID(c echo.Context) string {
    return c.Get("user_id").(string)
}
```

---

### 1A.5: Backend - Database Connection
**Priority**: P0  
**Estimated Time**: 1 hour

#### Description
Set up database connection pool and integrate with SQLC.

#### Steps
1. Add pgx dependency: `go get github.com/jackc/pgx/v5`
2. Create database connection in `internal/db/`
3. Initialize connection in main.go
4. Pass queries to handlers

#### Acceptance Criteria
- [ ] Database connects successfully
- [ ] Connection pool configured
- [ ] Graceful shutdown closes connections

#### Files to Create/Modify
```
backend/internal/db/
└── db.go                   # Database connection setup
backend/cmd/server/main.go  # Initialize DB connection
```

---

### 1A.6: Frontend - Clerk React SDK Setup
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Integrate Clerk React SDK for authentication UI.

#### Steps
1. Install Clerk: `bun add @clerk/clerk-react`
2. Create ClerkProvider wrapper
3. Configure environment variables
4. Update root layout with ClerkProvider

#### Acceptance Criteria
- [ ] Clerk SDK installed
- [ ] ClerkProvider wraps application
- [ ] Environment variables configured

#### Files to Create/Modify
```
frontend/
├── .env.example            # Add VITE_CLERK_PUBLISHABLE_KEY
├── src/
│   ├── main.tsx            # Wrap with ClerkProvider
│   └── lib/
│       └── clerk.ts        # Clerk configuration
```

#### Code Reference
```tsx
// main.tsx
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
)
```

---

### 1A.7: Frontend - Auth Pages
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create authentication pages using Clerk components.

#### Steps
1. Create sign-in page with `<SignIn />` component
2. Create sign-up page with `<SignUp />` component
3. Configure redirect URLs
4. Style pages to match application design

#### Acceptance Criteria
- [ ] Sign-in page renders Clerk SignIn component
- [ ] Sign-up page renders Clerk SignUp component
- [ ] Successful auth redirects to dashboard
- [ ] Pages are styled consistently

#### Files to Create
```
frontend/src/routes/
├── auth/
│   ├── sign-in.tsx
│   └── sign-up.tsx
```

---

### 1A.8: Frontend - Protected Routes & Dashboard
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create protected route wrapper and basic dashboard.

#### Steps
1. Create ProtectedRoute component using `useAuth()`
2. Create basic dashboard layout
3. Add user button/menu in header
4. Implement sign-out functionality

#### Acceptance Criteria
- [ ] Unauthenticated users redirected to sign-in
- [ ] Dashboard only accessible when authenticated
- [ ] User can see their name/email in header
- [ ] Sign-out works correctly

#### Files to Create/Modify
```
frontend/src/
├── components/
│   ├── ProtectedRoute.tsx
│   └── UserMenu.tsx
├── routes/
│   ├── __root.tsx          # Update header
│   └── dashboard/
│       └── index.tsx       # Basic dashboard
```

#### Code Reference
```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from '@tanstack/react-router'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  
  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <Navigate to="/auth/sign-in" />
  
  return <>{children}</>
}
```

---

### 1A.9: Frontend - API Client Setup
**Priority**: P1  
**Estimated Time**: 1-2 hours

#### Description
Create API client that automatically includes Clerk auth token.

#### Steps
1. Create API client with fetch wrapper
2. Add auth token to requests using `useAuth().getToken()`
3. Create React Query configuration
4. Add error handling for 401 responses

#### Acceptance Criteria
- [ ] API client includes auth token in headers
- [ ] 401 responses trigger re-authentication
- [ ] React Query configured for caching

#### Files to Create
```
frontend/src/lib/
└── api.ts                  # API client with auth
```

#### Code Reference
```tsx
// lib/api.ts
import { useAuth } from '@clerk/clerk-react'

export function useApiClient() {
  const { getToken } = useAuth()
  
  return async (endpoint: string, options?: RequestInit) => {
    const token = await getToken()
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }
}
```

---

### 1A.10: User Credits Initialization
**Priority**: P1  
**Estimated Time**: 1 hour

#### Description
Initialize user credits on first API request.

#### Steps
1. Create middleware/hook to check if user exists in credits table
2. If not, create record with 10 free generations
3. Add credits check endpoint

#### Acceptance Criteria
- [ ] New users get 10 free generations
- [ ] Credits record created on first authenticated request
- [ ] API endpoint to check remaining credits

#### Files to Create
```
backend/internal/
├── services/
│   └── credits/
│       └── credits.go      # Credits service
└── handlers/
    └── credits.go          # GET /api/credits endpoint
```

---

## Testing Checklist

### Manual Testing
- [ ] Sign up with new email
- [ ] Receive verification email (if enabled)
- [ ] Sign in with existing account
- [ ] Access dashboard when authenticated
- [ ] Get redirected when not authenticated
- [ ] Sign out and confirm redirect
- [ ] API requests include auth token
- [ ] API returns 401 without token

### API Testing
```bash
# Health check (no auth required)
curl http://localhost:8080/api/health

# Protected endpoint without token (should 401)
curl http://localhost:8080/api/profile

# Protected endpoint with token
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/profile
```

---

## Environment Variables

Add to `.env`:
```bash
# Clerk
CLERK_SECRET_KEY=sk_test_xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Database (existing)
DATABASE_URL=postgres://cvgen:cvgen_secret@localhost:5432/cvgen_db?sslmode=disable
```

---

## Definition of Done

Phase 1A is complete when:
- [ ] Users can sign up and sign in via Clerk
- [ ] Dashboard is protected and only accessible when authenticated
- [ ] Database schema is created and migrations run
- [ ] Backend validates Clerk JWT tokens
- [ ] API client sends auth tokens with requests
- [ ] New users are initialized with 10 free credits
- [ ] All tests pass
