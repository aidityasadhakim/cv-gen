# CV-Gen - Product Requirements Document (PRD)

**Version**: 1.1.0  
**Last Updated**: January 6, 2026  
**Status**: Draft

---

## Changelog

- **v1.1.0** (2026-01-06): Replaced Better Auth with Clerk for authentication. Added user credits table. Updated MVP scope to use manual job description paste (no URL parsing in MVP).
- **v1.0.0** (2026-01-06): Initial PRD draft.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Target Users](#target-users)
5. [MVP Features](#mvp-features)
6. [User Stories](#user-stories)
7. [User Flows](#user-flows)
8. [Data Model](#data-model)
9. [Technical Architecture](#technical-architecture)
10. [API Specification](#api-specification)
11. [UI/UX Requirements](#uiux-requirements)
12. [AI Integration](#ai-integration)
13. [Third-Party Integrations](#third-party-integrations)
14. [Non-Functional Requirements](#non-functional-requirements)
15. [MVP Phases & Timeline](#mvp-phases--timeline)
16. [Future Roadmap (v2)](#future-roadmap-v2)
17. [Success Metrics](#success-metrics)
18. [Open Questions](#open-questions)

---

## Executive Summary

CV-Gen is an AI-powered CV/resume generator that helps job seekers create tailored, professional resumes optimized for specific job postings. Users maintain a "Master Profile" containing all their career information, and the system generates customized CVs by analyzing job descriptions and matching relevant experience.

**Key Differentiator**: Drop a job posting URL or paste a job description, and CV-Gen automatically creates a tailored CV + cover letter optimized for that specific role.

**Tech Stack**:
- Backend: Go 1.24 + Echo v4 + PostgreSQL + SQLC
- Frontend: React 19 + TypeScript + TanStack Router/Query + Tailwind CSS v4
- Authentication: Clerk (SaaS) - Go SDK + React SDK
- AI: Google Gemini
- CV Schema: JSON Resume (jsonresume.org)
- Templates: JSON Resume Themes ecosystem
- PDF Generation: Client-side (react-pdf/jsPDF)

---

## Problem Statement

### Current Pain Points

1. **Time-consuming customization**: Job seekers spend 30-60 minutes tailoring each resume for different job applications
2. **Keyword optimization**: Applicants struggle to identify and incorporate relevant keywords from job postings
3. **ATS compatibility**: Many resumes fail Applicant Tracking System scans due to poor formatting or missing keywords
4. **Inconsistent quality**: Without professional guidance, resumes often undersell candidates' qualifications
5. **Cover letter fatigue**: Writing unique cover letters for each application is tedious and often skipped

### Market Gap

Existing CV builders (Canva, Resume.io, Zety) focus on templates and design but lack:
- Intelligent job-matching capabilities
- Automated content tailoring based on job descriptions
- AI-powered content suggestions that maintain authenticity

---

## Solution Overview

CV-Gen addresses these pain points through:

1. **Master Profile**: Single source of truth for all career data (JSON Resume schema)
2. **AI-Powered Tailoring**: Analyze job postings and automatically adjust CV content
3. **Smart Suggestions**: AI recommends which experiences/skills to highlight
4. **One-Click Generation**: Generate tailored CV + cover letter from job URL
5. **Professional Templates**: Leverage battle-tested JSON Resume themes
6. **Instant Export**: Client-side PDF generation for immediate download

---

## Target Users

### Primary Persona: Active Job Seeker

**Demographics**:
- Age: 22-45
- Tech-savvy professionals
- Applying to 5-50+ jobs per month
- Industries: Tech, Finance, Marketing, Healthcare, etc.

**Behaviors**:
- Uses job boards (LinkedIn, Indeed, Glassdoor)
- Applies to multiple similar roles
- Values speed and efficiency
- Willing to pay for tools that save time

**Goals**:
- Increase interview callback rate
- Reduce time spent on applications
- Stand out from other candidates
- Pass ATS screening

### Secondary Persona: Career Changer

**Needs**:
- Help repositioning existing experience for new industry
- Guidance on transferable skills
- Confidence in resume quality

---

## MVP Features

### Core Features (Must-Have)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F1 | User Authentication | Sign up, login, logout using Clerk | P0 |
| F2 | Master Profile Management | CRUD operations for JSON Resume data | P0 |
| F3 | Manual CV Generation | Create CV from master profile data | P0 |
| F4 | Job Description Input | Paste job description text for analysis | P0 |
| F5 | Job URL Parsing | Extract job description from URL via AI | P0 |
| F6 | AI-Tailored CV Generation | Generate CV optimized for specific job | P0 |
| F7 | AI Cover Letter Generation | Generate cover letter for specific job | P0 |
| F8 | Template Selection | Choose from JSON Resume themes | P0 |
| F9 | Real-time Preview | See CV changes instantly | P0 |
| F10 | PDF Export | Download CV as PDF (client-side) | P0 |
| F11 | Multiple CVs | Save and manage multiple generated CVs | P0 |
| F12 | Edit Generated CVs | Modify AI-generated content | P0 |

### Enhancement Features (Should-Have)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F13 | Job Match Score | Show how well profile matches job | P1 |
| F14 | Keyword Suggestions | Highlight missing keywords from job posting | P1 |
| F15 | Section Reordering | Drag-and-drop CV sections | P1 |
| F16 | Version History | Track changes to generated CVs | P2 |
| F17 | Duplicate CV | Clone existing CV as starting point | P2 |

### Out of Scope (MVP)

- Public shareable links
- LinkedIn import
- Payment/credits system
- Multi-language support
- Offline mode
- Team/organization features
- Analytics dashboard

---

## User Stories

### Authentication

```
US-1: As a new user, I want to sign up with email and password so that I can create an account.
US-2: As a returning user, I want to log in to access my saved data.
US-3: As a user, I want to reset my password if I forget it.
US-4: As a user, I want to log out to secure my account.
```

### Master Profile

```
US-5: As a user, I want to add my basic information (name, email, phone, location) so it appears on my CVs.
US-6: As a user, I want to add multiple work experiences with company, role, dates, and descriptions.
US-7: As a user, I want to add my education history with institution, degree, and dates.
US-8: As a user, I want to add my skills with proficiency levels.
US-9: As a user, I want to add projects I've worked on with descriptions and links.
US-10: As a user, I want to add certifications, awards, and publications.
US-11: As a user, I want to add languages I speak with fluency levels.
US-12: As a user, I want to add volunteer experience.
US-13: As a user, I want to edit or delete any profile section.
```

### CV Generation

```
US-14: As a user, I want to generate a general CV from my master profile.
US-15: As a user, I want to paste a job description and generate a tailored CV.
US-16: As a user, I want to provide a job posting URL and have the system extract the job description.
US-17: As a user, I want to see AI suggestions for what to emphasize based on the job.
US-18: As a user, I want to select a template for my CV.
US-19: As a user, I want to preview my CV in real-time as I make changes.
US-20: As a user, I want to edit the generated CV content before exporting.
US-21: As a user, I want to download my CV as a PDF.
```

### Cover Letter

```
US-22: As a user, I want to generate a cover letter tailored to a specific job.
US-23: As a user, I want to edit the generated cover letter.
US-24: As a user, I want to download my cover letter as a PDF.
```

### CV Management

```
US-25: As a user, I want to view all my generated CVs in a dashboard.
US-26: As a user, I want to name/rename my CVs for easy identification.
US-27: As a user, I want to delete CVs I no longer need.
US-28: As a user, I want to duplicate an existing CV to create variations.
```

---

## User Flows

### Flow 1: New User Onboarding

```
1. User lands on homepage
2. User clicks "Get Started" / "Sign Up"
3. User enters email and password
4. User verifies email (optional for MVP)
5. User is redirected to empty dashboard
6. System prompts user to complete Master Profile
7. User fills in profile sections (guided wizard or free-form)
8. User saves profile
9. Dashboard shows "Generate Your First CV" CTA
```

### Flow 2: Generate Tailored CV from Job URL

```
1. User clicks "New CV" from dashboard
2. User selects "Tailor for Job Posting"
3. User pastes job posting URL
4. System shows loading state "Analyzing job posting..."
5. AI extracts job description from URL
6. AI analyzes job requirements vs user profile
7. System displays:
   - Extracted job title and company
   - Match score (e.g., "85% match")
   - Key requirements identified
   - Suggested content adjustments
8. User reviews suggestions and clicks "Generate CV"
9. System generates tailored CV content
10. User sees real-time preview with selected template
11. User can:
    - Edit any section
    - Change template
    - Generate cover letter
12. User clicks "Download PDF"
13. PDF is generated client-side and downloaded
14. CV is saved to user's dashboard
```

### Flow 3: Generate Cover Letter

```
1. From CV preview, user clicks "Generate Cover Letter"
2. System uses job description + tailored CV data
3. AI generates personalized cover letter
4. User reviews and edits in editor
5. User downloads as PDF or copies text
6. Cover letter is linked to the CV
```

### Flow 4: Edit Master Profile

```
1. User navigates to Profile section
2. User sees all JSON Resume sections as expandable cards
3. User clicks on section to edit (e.g., "Work Experience")
4. User adds/edits/removes entries
5. Changes auto-save or user clicks "Save"
6. System validates data format
```

---

## Data Model

### Database Schema

```sql
-- Users table (managed by Clerk)
-- Clerk handles: users, sessions, OAuth accounts externally
-- We store Clerk user_id as reference in our tables

-- Master Profile (JSON Resume data)
CREATE TABLE master_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- Clerk user ID (e.g., "user_2NNEqL...")
    resume_data JSONB NOT NULL DEFAULT '{}',  -- Full JSON Resume schema
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)  -- One master profile per user
);

-- User Credits (for tracking free generations)
CREATE TABLE user_credits (
    user_id VARCHAR(255) PRIMARY KEY,  -- Clerk user ID
    free_generations_used INTEGER DEFAULT 0,
    free_generations_limit INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated CVs
CREATE TABLE generated_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- Clerk user ID
    name VARCHAR(255) NOT NULL,  -- User-defined name for the CV
    
    -- Job context
    job_url TEXT,                     -- Original job posting URL (if provided)
    job_title VARCHAR(255),           -- Extracted or user-provided
    company_name VARCHAR(255),        -- Extracted or user-provided
    job_description TEXT,             -- Full job description text
    
    -- Generated content
    cv_data JSONB NOT NULL,           -- Tailored JSON Resume data
    match_score INTEGER,              -- AI-calculated match percentage (0-100)
    ai_suggestions JSONB,             -- Stored suggestions for reference
    
    -- Template
    template_id VARCHAR(100) NOT NULL DEFAULT 'elegant',
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cover Letters
CREATE TABLE cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- Clerk user ID
    cv_id UUID REFERENCES generated_cvs(id) ON DELETE SET NULL,  -- Optional link to CV
    
    -- Content
    content TEXT NOT NULL,            -- The cover letter text
    
    -- Job context (denormalized for standalone letters)
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_master_profiles_user_id ON master_profiles(user_id);
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_generated_cvs_user_id ON generated_cvs(user_id);
CREATE INDEX idx_generated_cvs_created_at ON generated_cvs(created_at DESC);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_cover_letters_cv_id ON cover_letters(cv_id);
```

### JSON Resume Schema (Stored in `resume_data` JSONB)

```typescript
interface JSONResume {
  basics: {
    name: string
    label: string                    // e.g., "Software Engineer"
    image: string                    // URL to photo
    email: string
    phone: string
    url: string                      // Personal website
    summary: string
    location: {
      address: string
      postalCode: string
      city: string
      countryCode: string
      region: string
    }
    profiles: Array<{
      network: string               // e.g., "LinkedIn", "GitHub"
      username: string
      url: string
    }>
  }
  work: Array<{
    name: string                    // Company name
    position: string
    url: string
    startDate: string               // YYYY-MM-DD
    endDate: string                 // YYYY-MM-DD or empty for current
    summary: string
    highlights: string[]
  }>
  volunteer: Array<{
    organization: string
    position: string
    url: string
    startDate: string
    endDate: string
    summary: string
    highlights: string[]
  }>
  education: Array<{
    institution: string
    url: string
    area: string                    // e.g., "Computer Science"
    studyType: string               // e.g., "Bachelor"
    startDate: string
    endDate: string
    score: string                   // e.g., "3.8 GPA"
    courses: string[]
  }>
  awards: Array<{
    title: string
    date: string
    awarder: string
    summary: string
  }>
  certificates: Array<{
    name: string
    date: string
    issuer: string
    url: string
  }>
  publications: Array<{
    name: string
    publisher: string
    releaseDate: string
    url: string
    summary: string
  }>
  skills: Array<{
    name: string                    // e.g., "Web Development"
    level: string                   // e.g., "Master", "Intermediate"
    keywords: string[]              // e.g., ["HTML", "CSS", "JavaScript"]
  }>
  languages: Array<{
    language: string
    fluency: string                 // e.g., "Native", "Fluent", "Intermediate"
  }>
  interests: Array<{
    name: string
    keywords: string[]
  }>
  references: Array<{
    name: string
    reference: string               // The reference text/quote
  }>
  projects: Array<{
    name: string
    startDate: string
    endDate: string
    description: string
    highlights: string[]
    url: string
  }>
}
```

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  React 19 + TanStack Router/Query + Tailwind CSS v4            │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │  Profile │  │    CV    │  │  Cover   │       │
│  │  Pages   │  │  Editor  │  │ Generator│  │  Letter  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  JSON Resume Theme Renderer + PDF Export (react-pdf) │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                  │
│  Go 1.25 + Echo v4                                              │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │ Profile  │  │    CV    │  │   AI     │       │
│  │ Handler  │  │ Handler  │  │ Handler  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Clerk (Session Management)              │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│   PostgreSQL     │  │   Gemini     │  │  Web Scraper │
│   (SQLC/Goose)   │  │   API        │  │  (for URLs)  │
└──────────────────┘  └──────────────┘  └──────────────┘
```

### Component Breakdown

#### Backend Services

| Service | Responsibility |
|---------|----------------|
| `auth` | Clerk Go SDK integration, JWT validation middleware |
| `profile` | Master profile CRUD, JSON Resume validation |
| `cv` | CV generation, storage, retrieval |
| `coverletter` | Cover letter generation and storage |
| `ai` | Gemini integration, job parsing, content generation |
| `scraper` | URL fetching and job description extraction |

#### Frontend Structure

```
frontend/src/
├── routes/
│   ├── __root.tsx              # Root layout
│   ├── index.tsx               # Landing page
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── forgot-password.tsx
│   ├── dashboard/
│   │   └── index.tsx           # CV list, stats
│   ├── profile/
│   │   └── index.tsx           # Master profile editor
│   ├── cv/
│   │   ├── new.tsx             # New CV wizard
│   │   ├── $cvId/
│   │   │   ├── index.tsx       # CV view/edit
│   │   │   └── preview.tsx     # Full preview
│   └── cover-letter/
│       └── $cvId.tsx           # Cover letter editor
├── components/
│   ├── auth/
│   ├── profile/
│   │   ├── BasicInfoForm.tsx
│   │   ├── WorkExperienceForm.tsx
│   │   ├── EducationForm.tsx
│   │   └── ...
│   ├── cv/
│   │   ├── CVPreview.tsx
│   │   ├── TemplateSelector.tsx
│   │   ├── JobInputForm.tsx
│   │   └── MatchScore.tsx
│   ├── cover-letter/
│   └── ui/                     # Shared UI components
├── hooks/
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useCVs.ts
│   └── useAI.ts
├── lib/
│   ├── api.ts                  # API client
│   ├── pdf.ts                  # PDF generation
│   ├── themes.ts               # JSON Resume themes
│   └── utils.ts
└── types/
    ├── json-resume.ts
    ├── api.ts
    └── cv.ts
```

---

## API Specification

### Authentication (Clerk)

Clerk handles authentication externally. The backend validates JWT tokens from Clerk.

**Frontend**: Uses Clerk React SDK for UI components (`<SignIn/>`, `<SignUp/>`, `<UserButton/>`).

**Backend**: Validates Clerk JWT tokens via middleware.

```go
// Backend middleware extracts user ID from Clerk JWT
func clerkAuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        claims, ok := clerk.SessionClaimsFromContext(c.Request().Context())
        if !ok {
            return echo.NewHTTPError(401, "unauthorized")
        }
        // claims.Subject contains Clerk user ID
        c.Set("user_id", claims.Subject)
        return next(c)
    }
}
```

All API endpoints below require authentication (Clerk JWT in Authorization header).

### Profile API

```
GET    /api/profile              # Get master profile
PUT    /api/profile              # Update master profile (full replace)
PATCH  /api/profile/:section     # Update specific section (e.g., /api/profile/work)
```

**Request/Response Examples:**

```typescript
// GET /api/profile
// Response:
{
  "id": "uuid",
  "resume_data": { /* JSON Resume object */ },
  "created_at": "2026-01-06T00:00:00Z",
  "updated_at": "2026-01-06T00:00:00Z"
}

// PUT /api/profile
// Request:
{
  "resume_data": { /* Full JSON Resume object */ }
}

// PATCH /api/profile/work
// Request:
{
  "work": [
    { "name": "Company", "position": "Role", ... }
  ]
}
```

### CV API

```
GET    /api/cvs                  # List all CVs
POST   /api/cvs                  # Create new CV
GET    /api/cvs/:id              # Get specific CV
PUT    /api/cvs/:id              # Update CV
DELETE /api/cvs/:id              # Delete CV
POST   /api/cvs/:id/duplicate    # Duplicate CV
```

**Request/Response Examples:**

```typescript
// POST /api/cvs
// Request:
{
  "name": "Software Engineer at Google",
  "job_url": "https://careers.google.com/jobs/123",      // Optional
  "job_description": "We are looking for...",            // Optional, or extracted from URL
  "template_id": "elegant"
}

// Response:
{
  "id": "uuid",
  "name": "Software Engineer at Google",
  "job_url": "https://careers.google.com/jobs/123",
  "job_title": "Software Engineer",                      // AI-extracted
  "company_name": "Google",                              // AI-extracted
  "job_description": "We are looking for...",
  "cv_data": { /* Tailored JSON Resume */ },
  "match_score": 85,
  "ai_suggestions": {
    "highlights": ["Emphasize distributed systems experience", ...],
    "keywords_to_add": ["Kubernetes", "CI/CD", ...],
    "sections_to_prioritize": ["work", "skills", "projects"]
  },
  "template_id": "elegant",
  "created_at": "2026-01-06T00:00:00Z"
}
```

### Cover Letter API

```
GET    /api/cover-letters              # List all cover letters
POST   /api/cover-letters              # Create new cover letter
GET    /api/cover-letters/:id          # Get specific cover letter
PUT    /api/cover-letters/:id          # Update cover letter
DELETE /api/cover-letters/:id          # Delete cover letter
```

**Request/Response Examples:**

```typescript
// POST /api/cover-letters
// Request:
{
  "cv_id": "uuid",                      // Optional, link to existing CV
  "job_title": "Software Engineer",     // Required if no cv_id
  "company_name": "Google"              // Required if no cv_id
}

// Response:
{
  "id": "uuid",
  "cv_id": "uuid",
  "content": "Dear Hiring Manager,\n\nI am writing to express...",
  "job_title": "Software Engineer",
  "company_name": "Google",
  "created_at": "2026-01-06T00:00:00Z"
}
```

### AI API

```
POST   /api/ai/parse-job-url     # Extract job description from URL
POST   /api/ai/analyze-job       # Analyze job against profile
POST   /api/ai/generate-cv       # Generate tailored CV content
POST   /api/ai/generate-cover    # Generate cover letter
POST   /api/ai/suggestions       # Get improvement suggestions
```

**Request/Response Examples:**

```typescript
// POST /api/ai/parse-job-url
// Request:
{
  "url": "https://careers.google.com/jobs/123"
}

// Response:
{
  "job_title": "Software Engineer",
  "company_name": "Google",
  "job_description": "We are looking for a software engineer...",
  "requirements": ["5+ years experience", "Go or Python", ...],
  "parsed_successfully": true
}

// POST /api/ai/analyze-job
// Request:
{
  "job_description": "We are looking for...",
  "profile_data": { /* JSON Resume */ }
}

// Response:
{
  "match_score": 85,
  "matching_skills": ["Go", "PostgreSQL", "REST APIs"],
  "missing_skills": ["Kubernetes", "AWS"],
  "relevant_experiences": ["work[0]", "projects[1]"],
  "suggestions": [
    "Highlight your distributed systems work at Company X",
    "Add quantifiable metrics to your achievements"
  ]
}
```

---

## UI/UX Requirements

### Design Principles

1. **Simplicity**: Clean, uncluttered interface focused on the task
2. **Speed**: Minimize clicks to complete common actions
3. **Feedback**: Clear loading states and success/error messages
4. **Responsiveness**: Works on desktop and tablet (mobile is secondary)

### Key Screens

#### 1. Landing Page
- Hero section with value proposition
- "Get Started" CTA
- Brief feature highlights
- Social proof (future)

#### 2. Dashboard
- List of generated CVs as cards
- Each card shows: name, job title, company, match score, date
- Quick actions: View, Edit, Download, Delete
- "New CV" prominent button
- Empty state with guidance for new users

#### 3. Master Profile Editor
- Tab or accordion navigation for sections
- Forms for each JSON Resume section
- Real-time validation
- Progress indicator (% complete)
- Bulk import option (paste JSON)

#### 4. New CV Wizard
- Step 1: Choose type (General / Tailored for Job)
- Step 2a (General): Select sections to include
- Step 2b (Tailored): Enter job URL or paste description
- Step 3: Review AI analysis and suggestions
- Step 4: Select template
- Step 5: Preview and generate

#### 5. CV Editor/Preview
- Split view: Editor on left, Preview on right
- Template selector dropdown
- Section toggles (show/hide)
- Inline editing of content
- "Download PDF" button
- "Generate Cover Letter" button

#### 6. Cover Letter Editor
- Full-width text editor
- Linked job details displayed
- Download options

### Template Themes

Using JSON Resume themes from the ecosystem:

| Theme | Style | Best For |
|-------|-------|----------|
| `elegant` | Clean, professional | Corporate roles |
| `kendall` | Modern, minimal | Tech/startup |
| `stackoverflow` | Developer-focused | Engineering roles |
| `macchiato` | Creative | Design/marketing |
| `onepage` | Compact | Experienced professionals |

---

## AI Integration

### Google Gemini Configuration

```
Model: gemini-2.5-flash (cost-effective for MVP)
```

### AI Prompts Strategy

#### 1. Job URL Parsing Prompt

```
You are a job posting parser. Extract structured information from the following webpage content.

Webpage content:
{scraped_content}

Extract and return JSON:
{
  "job_title": "",
  "company_name": "",
  "location": "",
  "job_type": "", // full-time, part-time, contract
  "job_description": "", // full description
  "requirements": [], // list of requirements
  "responsibilities": [], // list of responsibilities
  "nice_to_have": [], // optional qualifications
  "salary_range": "" // if mentioned
}

If you cannot extract a field, use null.
```

#### 2. Job Analysis Prompt

```
You are a career advisor analyzing job fit. Compare the candidate's profile with the job requirements.

Candidate Profile (JSON Resume format):
{profile_json}

Job Description:
{job_description}

Analyze and return JSON:
{
  "match_score": 0-100,
  "matching_skills": [],
  "missing_skills": [],
  "relevant_experiences": [], // references to profile sections
  "suggestions": [], // specific advice
  "keywords_to_include": [] // important keywords from job description
}
```

#### 3. CV Tailoring Prompt

```
You are an expert resume writer. Create a tailored resume based on the candidate's master profile and the target job.

Master Profile:
{profile_json}

Target Job:
{job_description}

Analysis:
{analysis_json}

Create a tailored JSON Resume that:
1. Reorders sections to highlight most relevant experience first
2. Rewrites summaries and highlights to match job keywords
3. Emphasizes transferable skills
4. Maintains truthfulness - do not invent experience
5. Quantifies achievements where possible

Return the tailored resume in JSON Resume format.
```

#### 4. Cover Letter Generation Prompt

```
You are an expert cover letter writer. Create a compelling cover letter.

Candidate Profile:
{profile_json}

Target Position: {job_title} at {company_name}

Job Description:
{job_description}

Tailored CV Summary:
{cv_summary}

Write a professional cover letter that:
1. Opens with a compelling hook
2. Highlights 2-3 most relevant qualifications
3. Shows knowledge of the company
4. Expresses genuine enthusiasm
5. Ends with a clear call to action
6. Keeps length to 3-4 paragraphs

Return plain text (not markdown).
```

### Rate Limiting & Cost Management

- Implement request queuing
- Cache parsed job URLs (same URL = same result)
- Free tier: 10 generations per user (lifetime)
- Track generations in user_credits table
- Monitor token usage

---

## Third-Party Integrations

### MVP Integrations

| Service | Purpose | Notes |
|---------|---------|-------|
| Clerk | Authentication | SaaS, Go SDK + React SDK, free tier 10k MAU |
| Google Gemini | AI content generation | API key required |
| PostgreSQL | Database | Self-hosted via Docker |

### MVP Scope Clarification

- **Job URL Parsing**: Deferred - MVP uses manual job description paste only
- **Free Generations**: 10 per user (lifetime), tracked in database

### Web Scraping for Job URLs

For MVP, use server-side fetching with:
1. Standard HTTP client with browser-like headers
2. Send content to Gemini for intelligent extraction
3. Handle common job boards (LinkedIn, Indeed, Glassdoor)

```go
// Pseudo-code for job URL parsing
func parseJobURL(url string) (*JobPosting, error) {
    // 1. Fetch URL content
    html, err := fetchURL(url)
    
    // 2. Clean HTML (remove scripts, styles)
    text := extractText(html)
    
    // 3. Send to Gemini for extraction
    result, err := gemini.Parse(jobParsingPrompt, text)
    
    return result, nil
}
```

---

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Page load time | < 2 seconds |
| API response time | < 500ms (non-AI endpoints) |
| AI generation time | < 15 seconds |
| PDF generation | < 3 seconds |

### Security

- HTTPS everywhere
- JWT validation (handled by Clerk)
- Session-based authentication via Clerk
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (SQLC parameterized queries)
- XSS prevention

### Scalability (MVP)

- Support 100 concurrent users
- Handle 1000 CVs per day
- Database: Single PostgreSQL instance

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## MVP Phases & Timeline

### Phase 1A: Foundation (Week 1)

**Goal**: Authentication and basic infrastructure

- [ ] Set up Clerk account and configure application
- [ ] Integrate Clerk React SDK (frontend)
- [ ] Integrate Clerk Go SDK (backend)
- [ ] Create database migrations
- [ ] Implement auth middleware for protected routes
- [ ] Basic dashboard layout
- [ ] Set up user credits table (10 free generations)

**Deliverables**:
- Users can sign up, log in, log out via Clerk
- Protected dashboard page
- User credits initialized on first login

### Phase 1B: Master Profile (Week 2)

**Goal**: Users can manage their career data

- [ ] Profile database schema
- [ ] Profile CRUD API endpoints
- [ ] Profile editor UI (all JSON Resume sections)
- [ ] Form validation
- [ ] Auto-save functionality

**Deliverables**:
- Complete profile editor
- Data persists across sessions

### Phase 1C: Basic CV Generation (Week 3)

**Goal**: Generate CVs from profile (no AI yet)

- [ ] CV database schema
- [ ] CV CRUD API endpoints
- [ ] JSON Resume theme integration
- [ ] Template selector UI
- [ ] Real-time preview
- [ ] Client-side PDF export

**Deliverables**:
- Generate CV from profile
- Select template
- Download PDF

### Phase 1D: AI Integration (Week 4)

**Goal**: Job-tailored CV generation

- [ ] Gemini API integration
- [ ] Job URL parsing service
- [ ] Job analysis service
- [ ] CV tailoring service
- [ ] AI suggestions UI
- [ ] Job input form (URL + paste)

**Deliverables**:
- Paste job description -> tailored CV
- Paste job URL -> extract + tailor

### Phase 1E: Cover Letters & Polish (Week 5)

**Goal**: Cover letters and UX improvements

- [ ] Cover letter generation API
- [ ] Cover letter editor UI
- [ ] CV management (list, rename, delete, duplicate)
- [ ] Loading states and error handling
- [ ] Mobile responsiveness
- [ ] Bug fixes

**Deliverables**:
- Generate cover letters
- Full CV management
- Production-ready MVP

---

## Future Roadmap (v2)

### Credit System & Monetization
- User credits balance
- Pay for credits (Stripe integration)
- Credit consumption tracking
- Free tier limits

### LinkedIn Import
- OAuth with LinkedIn
- Import profile data
- Sync updates

### Multi-Language Support
- UI internationalization
- CV content translation
- Multiple language CVs

### Advanced Features
- Resume scoring with detailed feedback
- A/B test different CV versions
- Application tracking
- Interview prep based on job
- Salary insights

### Platform Expansion
- Mobile app (React Native)
- Browser extension for quick job capture
- API for third-party integrations

---

## Success Metrics

### MVP Success Criteria

| Metric | Target |
|--------|--------|
| User registration | 100 users in first month |
| CVs generated | 500 CVs in first month |
| Completion rate | 60% of signups create a CV |
| Return rate | 30% of users return within 7 days |
| PDF downloads | 80% of generated CVs downloaded |

### Key Performance Indicators (KPIs)

1. **Activation Rate**: % of signups who complete profile + generate CV
2. **Generation Success Rate**: % of AI generations completed without error
3. **Time to First CV**: Average time from signup to first CV download
4. **User Satisfaction**: NPS score (future)

---

## Open Questions

1. **Email verification**: Required for MVP or defer to v2?
2. **Rate limits**: What are reasonable daily limits for free MVP?
3. **Error handling**: What happens when Gemini API fails? Retry? Fallback?
4. **Job URL support**: Which job boards to prioritize? (LinkedIn blocks scraping)
5. **Template licensing**: Verify JSON Resume theme licenses for commercial use
6. **Data retention**: How long to keep generated CVs?
7. **GDPR compliance**: Data export/deletion requirements?

---

## Appendix

### A. JSON Resume Resources

- Official Schema: https://jsonresume.org/schema
- Theme Registry: https://jsonresume.org/themes
- Schema Validator: https://github.com/jsonresume/resume-schema

### B. Competitor Analysis

| Competitor | Strengths | Weaknesses |
|------------|-----------|------------|
| Resume.io | Great templates, easy to use | No AI, no job tailoring |
| Zety | AI suggestions | Expensive, generic suggestions |
| Teal | Job tracking | Complex UI, learning curve |
| Kickresume | AI writer | Quality inconsistent |

### C. Technical References

- Clerk: https://clerk.com/docs
- Clerk Go SDK: https://github.com/clerk/clerk-sdk-go
- Clerk React SDK: https://clerk.com/docs/quickstarts/react
- Google Gemini: https://ai.google.dev/
- JSON Resume: https://jsonresume.org/
- TanStack: https://tanstack.com/

---

*This PRD is a living document and will be updated as requirements evolve.*
