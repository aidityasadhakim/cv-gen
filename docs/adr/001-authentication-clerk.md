# ADR-001: Use Clerk for Authentication

**Date**: 2026-01-06  
**Status**: Accepted  
**Deciders**: Development Team

## Context

CV-Gen requires user authentication to:
- Protect user data (master profiles, generated CVs, cover letters)
- Track per-user generation limits (10 free generations)
- Provide personalized dashboard experience

The initial PRD specified Better Auth, a TypeScript-based authentication library. However, our backend is built with Go (Echo framework), which creates an integration challenge since Better Auth has no Go SDK.

## Decision Drivers

1. **Go Backend Compatibility**: Need official SDK or easy integration path
2. **React Frontend Support**: Pre-built components to speed up development
3. **Time to Market**: MVP needs to ship in 5 weeks
4. **Security**: Authentication is security-critical, prefer battle-tested solutions
5. **Cost**: Must be affordable for MVP stage
6. **Features**: Email/password authentication minimum, OAuth nice-to-have

## Options Considered

### Option 1: Better Auth (Original Plan)

**Description**: TypeScript-based auth library, self-hosted

**Pros**:
- Open source, self-hosted
- Full control over data
- No vendor lock-in

**Cons**:
- No Go SDK - would require running separate Node.js service
- Added infrastructure complexity
- More development time

### Option 2: Clerk (Selected)

**Description**: SaaS authentication platform with official Go and React SDKs

**Pros**:
- Official Go SDK (`github.com/clerk/clerk-sdk-go/v2`)
- Official React SDK with pre-built UI components
- Handles security best practices (password hashing, session management)
- Fast integration (hours, not days)
- Free tier: 10,000 MAU (sufficient for MVP)
- Built-in OAuth providers (Google, GitHub)
- Webhook support for user events

**Cons**:
- Vendor dependency
- Paid after 10k MAU
- User data stored externally

### Option 3: Custom JWT Implementation

**Description**: Build authentication from scratch using Go libraries

**Pros**:
- Full control
- No vendor dependency
- Free forever

**Cons**:
- Significant development time (1-2 weeks)
- Must implement security correctly (password hashing, session management, CSRF)
- Must build all UI components
- Ongoing maintenance burden

### Option 4: Ory Kratos

**Description**: Open-source, self-hosted identity management (written in Go)

**Pros**:
- Enterprise-grade security
- Self-hosted, open source
- Written in Go

**Cons**:
- Requires running additional Docker service
- Steeper learning curve
- More infrastructure to manage
- Overkill for MVP

## Decision

**Use Clerk for authentication.**

Clerk provides the best balance of:
- Development speed (official SDKs for both Go and React)
- Security (battle-tested, handles all auth concerns)
- Cost (free tier covers MVP needs)
- Features (email/password + OAuth ready to go)

## Consequences

### Positive

1. **Faster MVP delivery**: Auth can be implemented in 1-2 days instead of 1-2 weeks
2. **Reduced security risk**: Clerk handles password hashing, session management, CSRF
3. **Better UX**: Pre-built UI components look professional
4. **OAuth ready**: Can easily add Google/GitHub sign-in later

### Negative

1. **Vendor lock-in**: Switching auth providers later requires migration
2. **External dependency**: Service availability depends on Clerk
3. **Cost at scale**: Will need paid plan if >10k MAU

### Neutral

1. **User IDs**: Store Clerk's user ID (string like `user_2NNEqL...`) instead of internal UUID
2. **No foreign keys**: Cannot use DB foreign keys to Clerk users table

## Technical Implementation

### Backend (Go)

```go
import "github.com/clerk/clerk-sdk-go/v2"

// Middleware to validate Clerk JWT
func ClerkAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        ctx := c.Request().Context()
        claims, ok := clerk.SessionClaimsFromContext(ctx)
        if !ok {
            return echo.NewHTTPError(http.StatusUnauthorized, "unauthorized")
        }
        c.Set("user_id", claims.Subject)
        return next(c)
    }
}
```

### Frontend (React)

```tsx
import { ClerkProvider, SignIn, SignUp, useUser } from '@clerk/clerk-react'

// Wrap app with ClerkProvider
<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>

// Use pre-built components
<SignIn />
<SignUp />

// Access user in components
const { user, isSignedIn } = useUser()
```

### Database Schema

```sql
-- Use Clerk user ID (string) instead of UUID
CREATE TABLE master_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- Clerk user ID
    ...
);
```

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Go SDK](https://github.com/clerk/clerk-sdk-go)
- [Clerk React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Clerk Pricing](https://clerk.com/pricing) - Free tier: 10,000 MAU

## Review

This ADR should be reviewed if:
- User count approaches 10k MAU (cost implications)
- Clerk experiences significant outages
- Requirements change to require self-hosted auth
