# Phase 1C: Basic CV Generation

**Timeline**: Week 3  
**Goal**: Generate and preview CVs from master profile with template selection and PDF export

## Overview

This phase implements CV generation without AI - users can create CVs from their master profile, select templates from JSON Resume themes, preview in real-time, and export as PDF.

---

## Prerequisites

- Phase 1A completed (Authentication)
- Phase 1B completed (Master Profile)
- User has profile data to generate CV from

---

## Tasks

### 1C.1: Backend - CV Service
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create service layer for CV business logic.

#### Steps
1. Create CV service with CRUD operations
2. Implement CV creation from master profile
3. Handle CV naming and metadata
4. Add duplicate CV functionality

#### Acceptance Criteria
- [ ] Service handles create, read, update, delete, list
- [ ] Creates CV by copying master profile data
- [ ] Duplicate creates new CV from existing

#### Files to Create
```
backend/internal/services/cv/
├── service.go              # CV service
└── generator.go            # CV generation logic
```

---

### 1C.2: Backend - CV API Handlers
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create REST API handlers for CV operations.

#### Steps
1. GET /api/cvs - List all user's CVs
2. POST /api/cvs - Create new CV
3. GET /api/cvs/:id - Get specific CV
4. PUT /api/cvs/:id - Update CV
5. DELETE /api/cvs/:id - Delete CV
6. POST /api/cvs/:id/duplicate - Duplicate CV

#### Acceptance Criteria
- [ ] All CRUD operations work
- [ ] List is paginated
- [ ] Proper ownership validation
- [ ] Returns 404 for non-existent CVs

#### Files to Create
```
backend/internal/handlers/
└── cv.go                   # CV handlers
```

#### API Specification
```json
// POST /api/cvs
{
  "name": "My General CV",
  "template_id": "elegant"
}

// Response
{
  "id": "uuid",
  "name": "My General CV",
  "cv_data": { /* JSON Resume data from master profile */ },
  "template_id": "elegant",
  "created_at": "2026-01-06T00:00:00Z"
}
```

---

### 1C.3: Research - JSON Resume Theme Integration
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Research and decide how to render JSON Resume themes in React.

#### Options to Investigate
1. **resumed CLI** - Server-side HTML generation
2. **jsonresume-theme-* npm packages** - Direct rendering
3. **React-based themes** - If any exist
4. **Custom React components** - Build our own

#### Acceptance Criteria
- [ ] Decision documented
- [ ] Proof of concept for chosen approach
- [ ] At least 3 themes working

#### Deliverable
- ADR document: `docs/adr/002-json-resume-themes.md`

---

### 1C.4: Frontend - Theme Renderer
**Priority**: P0  
**Estimated Time**: 4-6 hours

#### Description
Implement JSON Resume theme rendering in React.

#### Steps (based on research)
1. Install necessary theme packages
2. Create theme renderer component
3. Handle theme switching
4. Style themes consistently
5. Ensure print-friendly output

#### Acceptance Criteria
- [ ] Can render CV with at least 3 themes
- [ ] Theme switching is seamless
- [ ] Output is print-ready

#### Files to Create
```
frontend/src/
├── lib/
│   └── themes/
│       ├── index.ts        # Theme registry
│       ├── renderer.ts     # Render logic
│       └── themes/         # Individual theme adapters
└── components/cv/
    └── ThemeRenderer.tsx
```

---

### 1C.5: Frontend - CV API Hooks
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create React Query hooks for CV API operations.

#### Steps
1. useCVs - List all CVs
2. useCV - Get single CV
3. useCreateCV - Create new CV
4. useUpdateCV - Update CV
5. useDeleteCV - Delete CV
6. useDuplicateCV - Duplicate CV

#### Acceptance Criteria
- [ ] All hooks implemented
- [ ] Proper cache invalidation
- [ ] Loading/error states

#### Files to Create
```
frontend/src/hooks/
└── useCVs.ts
```

---

### 1C.6: Frontend - Dashboard CV List
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Display list of user's CVs on dashboard.

#### Steps
1. Create CV card component
2. Show CV name, date, template
3. Add quick actions (view, edit, download, delete)
4. Handle empty state
5. Add "New CV" button

#### Acceptance Criteria
- [ ] CVs displayed as cards
- [ ] Actions work correctly
- [ ] Empty state guides user
- [ ] Loading state shown

#### Files to Create/Modify
```
frontend/src/
├── routes/dashboard/
│   └── index.tsx           # Update with CV list
└── components/cv/
    ├── CVCard.tsx
    └── CVList.tsx
```

---

### 1C.7: Frontend - New CV Page
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create page for creating new CV.

#### Steps
1. Create new CV route
2. Add CV name input
3. Add option: General CV or Tailored (Phase 1D)
4. Template selection
5. Create and redirect to editor

#### Acceptance Criteria
- [ ] Can name new CV
- [ ] Can select template
- [ ] Creates CV and redirects to editor

#### Files to Create
```
frontend/src/routes/cv/
└── new.tsx
```

---

### 1C.8: Frontend - CV Editor Page
**Priority**: P0  
**Estimated Time**: 4-6 hours

#### Description
Create split-view CV editor with real-time preview.

#### Steps
1. Create editor route
2. Implement split view layout
3. Left side: section toggles and editing
4. Right side: live preview
5. Add template selector
6. Add download button
7. Make responsive

#### Acceptance Criteria
- [ ] Split view works on desktop
- [ ] Section edits reflect in preview
- [ ] Template changes update preview
- [ ] Download button visible

#### Files to Create
```
frontend/src/routes/cv/
└── $cvId/
    └── index.tsx

frontend/src/components/cv/
├── CVEditor.tsx
├── CVPreview.tsx
├── SectionToggle.tsx
└── TemplateSelector.tsx
```

---

### 1C.9: Frontend - Template Selector Component
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create component for selecting CV template/theme.

#### Steps
1. Display available themes
2. Show theme preview/thumbnail
3. Allow selection
4. Persist selection to CV

#### Acceptance Criteria
- [ ] Shows available themes
- [ ] Selection updates preview
- [ ] Selection saved to backend

#### Files to Create
```
frontend/src/components/cv/
└── TemplateSelector.tsx
```

---

### 1C.10: Frontend - PDF Export
**Priority**: P0  
**Estimated Time**: 3-4 hours

#### Description
Implement client-side PDF generation.

#### Options
1. `react-to-pdf` - Simple, captures DOM
2. `html2pdf.js` - HTML to PDF conversion
3. `jsPDF` + `html2canvas` - More control
4. `@react-pdf/renderer` - React components to PDF

#### Steps
1. Choose PDF library
2. Implement PDF generation
3. Handle multi-page CVs
4. Ensure quality output
5. Add filename customization

#### Acceptance Criteria
- [ ] PDF generates correctly
- [ ] Multi-page CVs handled
- [ ] Output is high quality
- [ ] Filename includes CV name

#### Files to Create
```
frontend/src/lib/
└── pdf.ts                  # PDF generation utility

frontend/src/components/cv/
└── PDFExportButton.tsx
```

---

### 1C.11: Frontend - CV Section Editor
**Priority**: P1  
**Estimated Time**: 3-4 hours

#### Description
Allow editing CV content directly (not just master profile).

#### Steps
1. Create inline edit components for each section
2. Allow reordering sections
3. Allow hiding sections
4. Save changes to CV (not master profile)

#### Acceptance Criteria
- [ ] Can edit CV content inline
- [ ] Changes saved to this CV only
- [ ] Can hide/show sections
- [ ] Can reorder sections (nice-to-have)

---

### 1C.12: CV Rename and Delete
**Priority**: P1  
**Estimated Time**: 1 hour

#### Description
Allow users to rename and delete CVs.

#### Steps
1. Add rename modal/inline edit
2. Add delete confirmation dialog
3. Handle deletion redirect

#### Acceptance Criteria
- [ ] Can rename CV
- [ ] Delete shows confirmation
- [ ] Redirects after delete

---

## Testing Checklist

### API Testing
```bash
# List CVs
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/cvs

# Create CV
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test CV", "template_id": "elegant"}' \
  http://localhost:8080/api/cvs

# Get CV
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/cvs/<id>

# Update CV
curl -X PUT -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "cv_data": {...}}' \
  http://localhost:8080/api/cvs/<id>

# Delete CV
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8080/api/cvs/<id>

# Duplicate CV
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8080/api/cvs/<id>/duplicate
```

### Manual Testing
- [ ] Create new CV from dashboard
- [ ] View CV in editor with preview
- [ ] Switch between templates
- [ ] Edit CV content
- [ ] Download PDF
- [ ] Rename CV
- [ ] Delete CV
- [ ] Duplicate CV

### PDF Quality Check
- [ ] Text is selectable (not image)
- [ ] Links are clickable
- [ ] Formatting matches preview
- [ ] Multi-page breaks correctly

---

## Definition of Done

Phase 1C is complete when:
- [ ] Users can create CVs from master profile
- [ ] At least 3 templates/themes available
- [ ] Real-time preview works
- [ ] PDF export produces quality output
- [ ] CVs can be edited, renamed, deleted
- [ ] Dashboard shows all user's CVs
