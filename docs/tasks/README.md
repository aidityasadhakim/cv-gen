# CV-Gen Implementation Tasks Overview

**Total Timeline**: 5 Weeks  
**Last Updated**: January 6, 2026

## Phase Summary

| Phase | Timeline | Goal | Status |
|-------|----------|------|--------|
| [Phase 1A](./phase-1a-foundation-auth.md) | Week 1 | Foundation & Authentication (Clerk) | Not Started |
| [Phase 1B](./phase-1b-master-profile.md) | Week 2 | Master Profile Management | Not Started |
| [Phase 1C](./phase-1c-cv-generation.md) | Week 3 | Basic CV Generation & Templates | Not Started |
| [Phase 1D](./phase-1d-ai-integration.md) | Week 4 | AI Integration (Gemini) | Not Started |
| [Phase 1E](./phase-1e-cover-letters-polish.md) | Week 5 | Cover Letters & Polish | Not Started |

---

## Key Decisions

| Decision | Choice | ADR |
|----------|--------|-----|
| Authentication | Clerk (SaaS) | [ADR-001](../adr/001-authentication-clerk.md) |
| AI Provider | Google Gemini | PRD |
| CV Schema | JSON Resume | PRD |
| PDF Generation | Client-side | PRD |
| Free Tier | 10 generations/user | PRD |

---

## Task Counts by Phase

### Phase 1A: Foundation & Auth (10 tasks)
- 1A.1: Clerk Account Setup
- 1A.2: Database Migrations
- 1A.3: SQLC Configuration & Queries
- 1A.4: Backend - Clerk Go SDK Integration
- 1A.5: Backend - Database Connection
- 1A.6: Frontend - Clerk React SDK Setup
- 1A.7: Frontend - Auth Pages
- 1A.8: Frontend - Protected Routes & Dashboard
- 1A.9: Frontend - API Client Setup
- 1A.10: User Credits Initialization

### Phase 1B: Master Profile (15 tasks)
- 1B.1: Backend - Profile Service
- 1B.2: Backend - Profile API Handlers
- 1B.3: Backend - JSON Resume Types
- 1B.4: Frontend - Profile Types
- 1B.5: Frontend - Profile API Hooks
- 1B.6: Frontend - Profile Page Layout
- 1B.7: Frontend - Basic Info Form
- 1B.8: Frontend - Work Experience Form
- 1B.9: Frontend - Education Form
- 1B.10: Frontend - Skills Form
- 1B.11: Frontend - Projects Form
- 1B.12: Frontend - Additional Sections Forms
- 1B.13: Frontend - Form Validation
- 1B.14: Frontend - Auto-Save Implementation
- 1B.15: Frontend - JSON Import/Export

### Phase 1C: CV Generation (12 tasks)
- 1C.1: Backend - CV Service
- 1C.2: Backend - CV API Handlers
- 1C.3: Research - JSON Resume Theme Integration
- 1C.4: Frontend - Theme Renderer
- 1C.5: Frontend - CV API Hooks
- 1C.6: Frontend - Dashboard CV List
- 1C.7: Frontend - New CV Page
- 1C.8: Frontend - CV Editor Page
- 1C.9: Frontend - Template Selector Component
- 1C.10: Frontend - PDF Export
- 1C.11: Frontend - CV Section Editor
- 1C.12: CV Rename and Delete

### Phase 1D: AI Integration (12 tasks)
- 1D.1: Gemini API Setup
- 1D.2: Backend - AI Service Foundation
- 1D.3: Backend - Job Analysis Service
- 1D.4: Backend - CV Tailoring Service
- 1D.5: Backend - AI API Handlers
- 1D.6: Backend - Credits Integration
- 1D.7: Frontend - Job Input Form
- 1D.8: Frontend - AI Analysis Display
- 1D.9: Frontend - AI CV Generation Flow
- 1D.10: Frontend - Credits Display
- 1D.11: Frontend - Loading States for AI
- 1D.12: Error Handling for AI

### Phase 1E: Cover Letters & Polish (16 tasks)
- 1E.1: Backend - Cover Letter Service
- 1E.2: Backend - Cover Letter API Handlers
- 1E.3: Backend - Cover Letter Generation Prompt
- 1E.4: Frontend - Cover Letter API Hooks
- 1E.5: Frontend - Cover Letter Editor
- 1E.6: Frontend - Generate Cover Letter from CV
- 1E.7: Frontend - Cover Letter List in Dashboard
- 1E.8: Landing Page
- 1E.9: Error Handling & Toast Notifications
- 1E.10: Loading States & Skeletons
- 1E.11: Form Validation Polish
- 1E.12: Mobile Responsiveness
- 1E.13: Empty States
- 1E.14: Keyboard Navigation
- 1E.15: Performance Optimization
- 1E.16: Bug Fixes & QA

**Total Tasks**: 65

---

## Dependencies

```
Phase 1A (Auth)
    │
    ▼
Phase 1B (Profile) ──────────┐
    │                        │
    ▼                        │
Phase 1C (CV Generation) ────┤
    │                        │
    ▼                        │
Phase 1D (AI Integration) ◄──┘
    │
    ▼
Phase 1E (Cover Letters & Polish)
```

---

## Environment Variables Required

```bash
# Database
DATABASE_URL=url_db
POSTGRES_USER=db_user
POSTGRES_PASSWORD=db_pass
POSTGRES_DB=db_name

# Backend
BACKEND_PORT=8080
BACKEND_HOST=0.0.0.0

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxx
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Google Gemini AI
GEMINI_API_KEY=xxx

# Frontend
VITE_API_URL=http://localhost:8080
```

---

## Getting Started

1. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

2. **Start development**:
   ```bash
   make dev
   ```

3. **Run migrations** (after Phase 1A.2):
   ```bash
   make db-migrate
   ```

4. **Generate SQLC** (after Phase 1A.3):
   ```bash
   make sqlc
   ```

---

## Documentation Index

- [PRD](../PRD.md) - Product Requirements Document
- [ADR-001: Authentication](../adr/001-authentication-clerk.md) - Clerk decision
- [AGENTS.md](../../AGENTS.md) - Coding guidelines

---

## Quick Links

### Phase Details
- [Phase 1A: Foundation & Auth](./phase-1a-foundation-auth.md)
- [Phase 1B: Master Profile](./phase-1b-master-profile.md)
- [Phase 1C: CV Generation](./phase-1c-cv-generation.md)
- [Phase 1D: AI Integration](./phase-1d-ai-integration.md)
- [Phase 1E: Cover Letters & Polish](./phase-1e-cover-letters-polish.md)

### External Resources
- [Clerk Docs](https://clerk.com/docs)
- [Google Gemini](https://ai.google.dev/)
- [JSON Resume](https://jsonresume.org/)
- [TanStack](https://tanstack.com/)
