# Phase 1E: Cover Letters & Polish

**Timeline**: Week 5  
**Goal**: Add cover letter generation and polish the overall user experience

## Overview

This phase adds AI-powered cover letter generation, completes remaining features, and polishes the application for MVP launch.

---

## Prerequisites

- Phase 1A-1D completed
- AI integration working
- CV generation functional

---

## Tasks

### 1E.1: Backend - Cover Letter Service
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create service for cover letter generation and management.

#### Steps
1. Create cover letter service with CRUD operations
2. Implement AI generation using Gemini
3. Link cover letters to CVs (optional)
4. Store job context for reference

#### Acceptance Criteria
- [ ] Service handles create, read, update, delete
- [ ] AI generation produces quality letters
- [ ] Can link to existing CV

#### Files to Create
```
backend/internal/services/coverletter/
├── service.go              # Cover letter service
└── generator.go            # AI generation logic
```

---

### 1E.2: Backend - Cover Letter API Handlers
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create REST API handlers for cover letter operations.

#### Endpoints
1. GET /api/cover-letters - List all
2. POST /api/cover-letters - Create/generate
3. GET /api/cover-letters/:id - Get one
4. PUT /api/cover-letters/:id - Update
5. DELETE /api/cover-letters/:id - Delete

#### Acceptance Criteria
- [ ] All CRUD operations work
- [ ] Generation costs 1 credit
- [ ] Proper authentication

#### Files to Create
```
backend/internal/handlers/
└── cover_letter.go
```

#### API Specification
```json
// POST /api/cover-letters
{
  "cv_id": "uuid",           // Optional - links to CV
  "job_title": "Software Engineer",
  "company_name": "Google",
  "job_description": "..."   // Optional if cv_id provided
}

// Response
{
  "id": "uuid",
  "cv_id": "uuid",
  "content": "Dear Hiring Manager,\n\n...",
  "job_title": "Software Engineer",
  "company_name": "Google",
  "created_at": "..."
}
```

---

### 1E.3: Backend - Cover Letter Generation Prompt
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create and refine the AI prompt for cover letter generation.

#### Prompt Requirements
1. Professional tone
2. Compelling opening hook
3. 2-3 relevant qualifications highlighted
4. Shows knowledge of company (if available)
5. Clear call to action
6. 3-4 paragraphs max

#### Acceptance Criteria
- [ ] Generated letters are professional
- [ ] Content is relevant to job
- [ ] Length is appropriate
- [ ] Tone is enthusiastic but not excessive

#### Files to Modify
```
backend/internal/services/ai/
└── prompts.go              # Add cover letter prompt
```

---

### 1E.4: Frontend - Cover Letter API Hooks
**Priority**: P0  
**Estimated Time**: 1 hour

#### Description
Create React Query hooks for cover letter operations.

#### Hooks
1. useCoverLetters - List all
2. useCoverLetter - Get one
3. useCreateCoverLetter - Generate new
4. useUpdateCoverLetter - Edit
5. useDeleteCoverLetter - Delete

#### Files to Create
```
frontend/src/hooks/
└── useCoverLetters.ts
```

---

### 1E.5: Frontend - Cover Letter Editor
**Priority**: P0  
**Estimated Time**: 3-4 hours

#### Description
Create page for viewing and editing cover letters.

#### Steps
1. Create cover letter route
2. Display generated content in editor
3. Allow inline editing
4. Show job context (title, company)
5. Add PDF download
6. Add copy to clipboard

#### Acceptance Criteria
- [ ] Can view cover letter
- [ ] Can edit content
- [ ] Can download as PDF
- [ ] Can copy to clipboard

#### Files to Create
```
frontend/src/routes/cover-letter/
└── $id.tsx

frontend/src/components/cover-letter/
├── CoverLetterEditor.tsx
└── CoverLetterActions.tsx
```

---

### 1E.6: Frontend - Generate Cover Letter from CV
**Priority**: P0  
**Estimated Time**: 2 hours

#### Description
Add button to generate cover letter from CV editor.

#### Steps
1. Add "Generate Cover Letter" button to CV editor
2. Create modal/page for generation
3. Show generation progress
4. Redirect to cover letter editor

#### Acceptance Criteria
- [ ] Button visible on CV editor
- [ ] Generation uses CV's job context
- [ ] Seamless flow to editor

#### Files to Modify
```
frontend/src/routes/cv/$cvId/
└── index.tsx               # Add generate button
```

---

### 1E.7: Frontend - Cover Letter List in Dashboard
**Priority**: P1  
**Estimated Time**: 1-2 hours

#### Description
Show cover letters in dashboard alongside CVs.

#### Steps
1. Add cover letters section/tab
2. Show linked CV if applicable
3. Add quick actions (view, edit, download, delete)

#### Acceptance Criteria
- [ ] Cover letters visible in dashboard
- [ ] Shows linked CV name
- [ ] Actions work correctly

---

### 1E.8: Landing Page
**Priority**: P1  
**Estimated Time**: 3-4 hours

#### Description
Create compelling landing page for new visitors.

#### Sections
1. Hero with value proposition
2. Key features (3-4 highlights)
3. How it works (3 steps)
4. CTA to sign up
5. Footer with links

#### Acceptance Criteria
- [ ] Clear value proposition
- [ ] Professional design
- [ ] Strong CTAs
- [ ] Mobile responsive

#### Files to Modify
```
frontend/src/routes/
└── index.tsx               # Landing page
```

---

### 1E.9: Error Handling & Toast Notifications
**Priority**: P1  
**Estimated Time**: 2-3 hours

#### Description
Implement consistent error handling and user feedback.

#### Steps
1. Install toast library (react-hot-toast or similar)
2. Add success toasts for actions
3. Add error toasts for failures
4. Create error boundary component
5. Handle network errors globally

#### Acceptance Criteria
- [ ] Success actions show toast
- [ ] Errors show helpful message
- [ ] No silent failures
- [ ] Error boundary catches crashes

#### Files to Create
```
frontend/src/components/
├── Toast.tsx
└── ErrorBoundary.tsx
```

---

### 1E.10: Loading States & Skeletons
**Priority**: P1  
**Estimated Time**: 2-3 hours

#### Description
Add loading states throughout the application.

#### Areas to Add
1. Dashboard CV list
2. Profile sections
3. CV editor
4. Cover letter editor
5. AI operations

#### Acceptance Criteria
- [ ] Loading indicators visible
- [ ] Skeleton loaders where appropriate
- [ ] No layout shift on load

#### Files to Create
```
frontend/src/components/ui/
├── Skeleton.tsx
└── LoadingSpinner.tsx
```

---

### 1E.11: Form Validation Polish
**Priority**: P1  
**Estimated Time**: 2 hours

#### Description
Ensure all forms have proper validation and feedback.

#### Steps
1. Review all forms
2. Add missing validation
3. Improve error messages
4. Add inline validation where missing

#### Acceptance Criteria
- [ ] All required fields validated
- [ ] Error messages are helpful
- [ ] Validation happens on blur and submit

---

### 1E.12: Mobile Responsiveness
**Priority**: P1  
**Estimated Time**: 3-4 hours

#### Description
Ensure application works on tablet and mobile.

#### Steps
1. Test all pages on mobile viewport
2. Fix layout issues
3. Adjust CV preview for mobile
4. Ensure forms are usable
5. Test touch interactions

#### Acceptance Criteria
- [ ] Dashboard usable on tablet
- [ ] Forms work on mobile
- [ ] Navigation works on all sizes
- [ ] PDF download works on mobile

---

### 1E.13: Empty States
**Priority**: P2  
**Estimated Time**: 1-2 hours

#### Description
Create helpful empty states for all lists.

#### Areas
1. No CVs yet
2. No cover letters yet
3. Empty profile sections

#### Acceptance Criteria
- [ ] Empty states have guidance
- [ ] CTAs to take action
- [ ] Visually appealing

---

### 1E.14: Keyboard Navigation
**Priority**: P2  
**Estimated Time**: 1-2 hours

#### Description
Ensure keyboard accessibility.

#### Steps
1. Test tab navigation
2. Add keyboard shortcuts where useful
3. Ensure focus states visible
4. Test with screen reader (basic)

#### Acceptance Criteria
- [ ] Can navigate by keyboard
- [ ] Focus states visible
- [ ] No keyboard traps

---

### 1E.15: Performance Optimization
**Priority**: P2  
**Estimated Time**: 2-3 hours

#### Description
Optimize frontend performance.

#### Steps
1. Analyze bundle size
2. Add code splitting for routes
3. Optimize images
4. Add caching headers
5. Lazy load heavy components

#### Acceptance Criteria
- [ ] Initial load < 3 seconds
- [ ] Lighthouse score > 80
- [ ] No unnecessary re-renders

---

### 1E.16: Bug Fixes & QA
**Priority**: P0  
**Estimated Time**: 4-6 hours

#### Description
Comprehensive testing and bug fixing.

#### Steps
1. Test all user flows
2. Test edge cases
3. Fix identified bugs
4. Test on multiple browsers
5. Test with real user data

#### Test Cases
- [ ] Complete signup to CV download flow
- [ ] Profile with all sections
- [ ] CV with all templates
- [ ] AI generation with various jobs
- [ ] Cover letter generation
- [ ] Credits reaching 0
- [ ] Error recovery

---

## Cover Letter Prompt Template

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
1. Opens with a compelling hook (not "I am writing to apply...")
2. Highlights 2-3 most relevant qualifications from the candidate's experience
3. Shows enthusiasm for the role and company
4. Demonstrates understanding of what the role requires
5. Ends with a confident call to action
6. Keeps length to 3-4 paragraphs (250-350 words)

Guidelines:
- Be specific, not generic
- Use active voice
- Avoid clichés
- Match tone to the company culture (startup vs corporate)
- Reference specific experiences from the profile

Return plain text only (no markdown formatting).
```

---

## Testing Checklist

### Cover Letter Testing
```bash
# List cover letters
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/cover-letters

# Generate cover letter
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"cv_id": "uuid", "job_title": "Engineer", "company_name": "Google"}' \
  http://localhost:8080/api/cover-letters
```

### End-to-End Testing
1. [ ] New user signup
2. [ ] Complete profile (all sections)
3. [ ] Create general CV
4. [ ] Download PDF
5. [ ] Create tailored CV
6. [ ] Generate cover letter
7. [ ] Edit cover letter
8. [ ] Download cover letter
9. [ ] Use all 10 free credits
10. [ ] Verify blocked when out of credits

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## Definition of Done

Phase 1E is complete when:
- [ ] Cover letter generation works
- [ ] Cover letters can be edited and downloaded
- [ ] Landing page is complete
- [ ] Error handling is consistent
- [ ] Loading states are in place
- [ ] Mobile responsive
- [ ] No critical bugs
- [ ] All user flows work end-to-end

---

## MVP Launch Checklist

Before launching MVP:

### Technical
- [ ] All features working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Error handling complete
- [ ] Logging in place

### Security
- [ ] Authentication working
- [ ] Authorization checked
- [ ] Input validation complete
- [ ] No sensitive data exposed

### Content
- [ ] Landing page complete
- [ ] Error messages helpful
- [ ] Empty states in place

### Operations
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Monitoring in place (optional for MVP)
- [ ] Backup strategy (optional for MVP)
