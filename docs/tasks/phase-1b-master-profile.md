# Phase 1B: Master Profile Management

**Timeline**: Week 2  
**Goal**: Users can create and manage their career data using JSON Resume schema

## Overview

This phase implements the Master Profile feature - a single source of truth for all user career data stored in JSON Resume format.

---

## Prerequisites

- Phase 1A completed (Authentication working)
- Database migrations applied
- SQLC queries generated

---

## Tasks

### 1B.1: Backend - Profile Service
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create service layer for master profile business logic.

#### Steps
1. Create profile service with CRUD operations
2. Implement JSON Resume validation
3. Handle partial updates (PATCH)
4. Add created_at/updated_at handling

#### Acceptance Criteria
- [ ] Service handles create, read, update operations
- [ ] Validates JSON Resume structure
- [ ] Returns appropriate errors for invalid data

#### Files to Create
```
backend/internal/
├── services/
│   └── profile/
│       ├── service.go      # Profile service
│       └── validation.go   # JSON Resume validation
└── models/
    └── json_resume.go      # JSON Resume Go types
```

#### Code Reference
```go
// services/profile/service.go
type Service struct {
    queries *db.Queries
}

func (s *Service) GetProfile(ctx context.Context, userID string) (*db.MasterProfile, error)
func (s *Service) CreateProfile(ctx context.Context, userID string, data json.RawMessage) (*db.MasterProfile, error)
func (s *Service) UpdateProfile(ctx context.Context, userID string, data json.RawMessage) (*db.MasterProfile, error)
func (s *Service) UpdateSection(ctx context.Context, userID string, section string, data json.RawMessage) (*db.MasterProfile, error)
```

---

### 1B.2: Backend - Profile API Handlers
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create REST API handlers for profile operations.

#### Steps
1. Create GET /api/profile handler
2. Create PUT /api/profile handler
3. Create PATCH /api/profile/:section handler
4. Add request validation
5. Add proper error responses

#### Acceptance Criteria
- [ ] GET returns user's profile or empty default
- [ ] PUT replaces entire profile
- [ ] PATCH updates specific section
- [ ] All endpoints require authentication

#### Files to Create
```
backend/internal/handlers/
└── profile.go              # Profile handlers
```

#### API Specification
```
GET    /api/profile              # Get master profile
PUT    /api/profile              # Update master profile (full replace)
PATCH  /api/profile/:section     # Update specific section
```

#### Response Examples
```json
// GET /api/profile
{
  "id": "uuid",
  "user_id": "user_xxx",
  "resume_data": {
    "basics": { "name": "John Doe", ... },
    "work": [...],
    "education": [...]
  },
  "created_at": "2026-01-06T00:00:00Z",
  "updated_at": "2026-01-06T00:00:00Z"
}
```

---

### 1B.3: Backend - JSON Resume Types
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Define Go structs for JSON Resume schema.

#### Steps
1. Create struct for each JSON Resume section
2. Add JSON tags for serialization
3. Add validation tags (optional)
4. Create helper functions for manipulation

#### Acceptance Criteria
- [ ] All JSON Resume sections have Go types
- [ ] Types serialize/deserialize correctly
- [ ] Optional fields handled properly

#### Files to Create
```
backend/internal/models/
└── json_resume.go
```

#### Type Definitions
```go
type JSONResume struct {
    Basics       *Basics       `json:"basics,omitempty"`
    Work         []Work        `json:"work,omitempty"`
    Volunteer    []Volunteer   `json:"volunteer,omitempty"`
    Education    []Education   `json:"education,omitempty"`
    Awards       []Award       `json:"awards,omitempty"`
    Certificates []Certificate `json:"certificates,omitempty"`
    Publications []Publication `json:"publications,omitempty"`
    Skills       []Skill       `json:"skills,omitempty"`
    Languages    []Language    `json:"languages,omitempty"`
    Interests    []Interest    `json:"interests,omitempty"`
    References   []Reference   `json:"references,omitempty"`
    Projects     []Project     `json:"projects,omitempty"`
}

type Basics struct {
    Name     string    `json:"name"`
    Label    string    `json:"label,omitempty"`
    Image    string    `json:"image,omitempty"`
    Email    string    `json:"email"`
    Phone    string    `json:"phone,omitempty"`
    URL      string    `json:"url,omitempty"`
    Summary  string    `json:"summary,omitempty"`
    Location *Location `json:"location,omitempty"`
    Profiles []Profile `json:"profiles,omitempty"`
}
// ... (full types in implementation)
```

---

### 1B.4: Frontend - Profile Types
**Priority**: P0  
**Estimated Time**: 1 hour

#### Description
Create TypeScript types for JSON Resume schema.

#### Steps
1. Define interfaces for all JSON Resume sections
2. Create type guards if needed
3. Export types for use across components

#### Acceptance Criteria
- [ ] All JSON Resume sections have TypeScript interfaces
- [ ] Types match backend expectations
- [ ] Types are exported and reusable

#### Files to Create
```
frontend/src/types/
└── json-resume.ts
```

---

### 1B.5: Frontend - Profile API Hooks
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create React Query hooks for profile API operations.

#### Steps
1. Create useProfile query hook
2. Create useUpdateProfile mutation hook
3. Create useUpdateSection mutation hook
4. Add optimistic updates
5. Handle loading and error states

#### Acceptance Criteria
- [ ] Hooks fetch and cache profile data
- [ ] Mutations update server and cache
- [ ] Loading states available
- [ ] Error handling implemented

#### Files to Create
```
frontend/src/hooks/
└── useProfile.ts
```

#### Code Reference
```tsx
// hooks/useProfile.ts
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/api/profile'),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: JSONResume) => api.put('/api/profile', { resume_data: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })
}
```

---

### 1B.6: Frontend - Profile Page Layout
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create the main profile editing page with section navigation.

#### Steps
1. Create profile page route
2. Add section navigation (tabs or accordion)
3. Display completion progress
4. Add "Import JSON" option
5. Create responsive layout

#### Acceptance Criteria
- [ ] Profile page accessible from dashboard
- [ ] Section navigation works
- [ ] Shows which sections are complete
- [ ] Responsive on tablet/desktop

#### Files to Create
```
frontend/src/routes/
└── profile/
    └── index.tsx

frontend/src/components/profile/
├── ProfileLayout.tsx
├── SectionNav.tsx
└── ProgressIndicator.tsx
```

---

### 1B.7: Frontend - Basic Info Form
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create form for editing basic information (name, email, phone, location, etc.).

#### Steps
1. Create form component with all basic fields
2. Add form validation
3. Handle location sub-fields
4. Handle social profiles array
5. Implement auto-save or save button

#### Acceptance Criteria
- [ ] All basic info fields editable
- [ ] Location fields grouped appropriately
- [ ] Social profiles can be added/removed
- [ ] Validation prevents invalid data
- [ ] Changes persist to backend

#### Files to Create
```
frontend/src/components/profile/
├── BasicInfoForm.tsx
├── LocationFields.tsx
└── SocialProfilesField.tsx
```

---

### 1B.8: Frontend - Work Experience Form
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create form for managing work experience entries.

#### Steps
1. Create work experience list view
2. Create add/edit form for single entry
3. Handle highlights array (bullet points)
4. Add date pickers for start/end dates
5. Handle "current position" (no end date)
6. Allow reordering entries

#### Acceptance Criteria
- [ ] Can add new work experience
- [ ] Can edit existing entries
- [ ] Can delete entries
- [ ] Highlights can be added/removed
- [ ] Date handling works correctly

#### Files to Create
```
frontend/src/components/profile/
├── WorkExperienceForm.tsx
├── WorkExperienceList.tsx
└── WorkExperienceItem.tsx
```

---

### 1B.9: Frontend - Education Form
**Priority**: P0  
**Estimated Time**: 2 hours

#### Description
Create form for managing education entries.

#### Steps
1. Create education list view
2. Create add/edit form
3. Handle courses array
4. Add date pickers
5. Allow reordering

#### Acceptance Criteria
- [ ] Can add/edit/delete education entries
- [ ] Courses can be listed
- [ ] Dates handled correctly

#### Files to Create
```
frontend/src/components/profile/
├── EducationForm.tsx
└── EducationList.tsx
```

---

### 1B.10: Frontend - Skills Form
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create form for managing skills.

#### Steps
1. Create skills list with categories
2. Allow adding skill name and level
3. Handle keywords array per skill
4. Visual representation of skill level

#### Acceptance Criteria
- [ ] Can add/edit/delete skills
- [ ] Keywords can be added per skill
- [ ] Skill level selectable

#### Files to Create
```
frontend/src/components/profile/
├── SkillsForm.tsx
└── SkillItem.tsx
```

---

### 1B.11: Frontend - Projects Form
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Create form for managing projects.

#### Steps
1. Create projects list
2. Create add/edit form
3. Handle highlights array
4. Add URL field
5. Add date range

#### Acceptance Criteria
- [ ] Can add/edit/delete projects
- [ ] Highlights supported
- [ ] URL and dates handled

#### Files to Create
```
frontend/src/components/profile/
├── ProjectsForm.tsx
└── ProjectsList.tsx
```

---

### 1B.12: Frontend - Additional Sections Forms
**Priority**: P1  
**Estimated Time**: 3-4 hours

#### Description
Create forms for remaining JSON Resume sections.

#### Sections to Implement
1. Certificates
2. Awards
3. Publications
4. Languages
5. Volunteer
6. Interests
7. References

#### Acceptance Criteria
- [ ] All sections have functional forms
- [ ] Data persists correctly
- [ ] Consistent UI across sections

#### Files to Create
```
frontend/src/components/profile/
├── CertificatesForm.tsx
├── AwardsForm.tsx
├── PublicationsForm.tsx
├── LanguagesForm.tsx
├── VolunteerForm.tsx
├── InterestsForm.tsx
└── ReferencesForm.tsx
```

---

### 1B.13: Frontend - Form Validation
**Priority**: P1  
**Estimated Time**: 2 hours

#### Description
Add comprehensive form validation across all profile forms.

#### Steps
1. Add required field validation
2. Add format validation (email, URL, phone)
3. Add date validation (start before end)
4. Display validation errors inline
5. Prevent submission of invalid data

#### Acceptance Criteria
- [ ] Required fields enforced
- [ ] Format validation works
- [ ] Error messages clear and helpful
- [ ] Invalid forms cannot submit

---

### 1B.14: Frontend - Auto-Save Implementation
**Priority**: P2  
**Estimated Time**: 2 hours

#### Description
Implement auto-save functionality with debouncing.

#### Steps
1. Add debounced save on form changes
2. Show save status indicator
3. Handle save conflicts
4. Add manual save button as backup

#### Acceptance Criteria
- [ ] Changes auto-save after 2 second delay
- [ ] User sees save status
- [ ] No data loss on navigation

---

### 1B.15: Frontend - JSON Import/Export
**Priority**: P2  
**Estimated Time**: 1-2 hours

#### Description
Allow users to import/export profile as JSON.

#### Steps
1. Add "Import JSON" button
2. Validate imported JSON against schema
3. Add "Export JSON" button
4. Copy to clipboard option

#### Acceptance Criteria
- [ ] Can paste JSON Resume and import
- [ ] Invalid JSON shows error
- [ ] Can export current profile as JSON

---

## Testing Checklist

### API Testing
```bash
# Get profile (empty initially)
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/profile

# Create/update profile
curl -X PUT -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"resume_data": {"basics": {"name": "John Doe"}}}' \
  http://localhost:8080/api/profile

# Update specific section
curl -X PATCH -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"work": [{"name": "Company", "position": "Developer"}]}' \
  http://localhost:8080/api/profile/work
```

### Manual Testing
- [ ] Create new profile from scratch
- [ ] Edit each section type
- [ ] Add/remove list items (work, education, etc.)
- [ ] Verify data persists after refresh
- [ ] Test auto-save functionality
- [ ] Import JSON Resume from external source
- [ ] Export profile as JSON

---

## Definition of Done

Phase 1B is complete when:
- [ ] Users can view their profile (empty or populated)
- [ ] Users can edit all JSON Resume sections
- [ ] Data persists correctly to database
- [ ] Forms have proper validation
- [ ] UI is responsive and user-friendly
- [ ] Auto-save works reliably
- [ ] Import/export JSON works
