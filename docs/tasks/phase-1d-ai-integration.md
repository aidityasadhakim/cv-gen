# Phase 1D: AI Integration

**Timeline**: Week 4  
**Goal**: Integrate Google Gemini for job-tailored CV generation

## Overview

This phase adds AI-powered features: analyzing job descriptions, generating tailored CVs, and providing match scores and suggestions.

---

## Prerequisites

- Phase 1A-1C completed
- Google Cloud account with Gemini API access
- GEMINI_API_KEY environment variable

---

## Tasks

### 1D.1: Gemini API Setup
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Set up Google Gemini API access and configuration.

#### Steps
1. Create Google Cloud project (or use existing)
2. Enable Generative AI API
3. Create API key
4. Add to environment variables
5. Test API connectivity

#### Acceptance Criteria
- [ ] API key created and stored securely
- [ ] Can make test request to Gemini
- [ ] Environment variable documented

#### Environment Variables
```bash
GEMINI_API_KEY=your_api_key_here
```

---

### 1D.2: Backend - AI Service Foundation
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create AI service layer for Gemini integration.

#### Steps
1. Add Gemini Go SDK: `go get github.com/google/generative-ai-go`
2. Create AI service with Gemini client
3. Implement rate limiting
4. Add error handling and retries
5. Create prompt templates

#### Acceptance Criteria
- [ ] Gemini client initialized
- [ ] Rate limiting implemented
- [ ] Errors handled gracefully

#### Files to Create
```
backend/internal/services/ai/
├── service.go              # AI service
├── gemini.go               # Gemini client wrapper
├── prompts.go              # Prompt templates
└── types.go                # Request/response types
```

#### Code Reference
```go
// services/ai/gemini.go
package ai

import (
    "context"
    "github.com/google/generative-ai-go/genai"
    "google.golang.org/api/option"
)

type GeminiClient struct {
    client *genai.Client
    model  *genai.GenerativeModel
}

func NewGeminiClient(apiKey string) (*GeminiClient, error) {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        return nil, err
    }
    
    model := client.GenerativeModel("gemini-1.5-flash")
    model.SetTemperature(0.7)
    
    return &GeminiClient{client: client, model: model}, nil
}
```

---

### 1D.3: Backend - Job Analysis Service
**Priority**: P0  
**Estimated Time**: 3-4 hours

#### Description
Create service to analyze job descriptions against user profile.

#### Steps
1. Create analyze job prompt
2. Parse Gemini response into structured data
3. Calculate match score
4. Extract keywords and suggestions
5. Handle edge cases (short descriptions, etc.)

#### Acceptance Criteria
- [ ] Accepts job description and profile
- [ ] Returns match score (0-100)
- [ ] Returns matching/missing skills
- [ ] Returns actionable suggestions

#### Files to Create
```
backend/internal/services/ai/
└── analyzer.go             # Job analysis logic
```

#### API Response Structure
```go
type JobAnalysis struct {
    MatchScore         int      `json:"match_score"`
    MatchingSkills     []string `json:"matching_skills"`
    MissingSkills      []string `json:"missing_skills"`
    RelevantExperiences []string `json:"relevant_experiences"`
    Suggestions        []string `json:"suggestions"`
    KeywordsToInclude  []string `json:"keywords_to_include"`
}
```

---

### 1D.4: Backend - CV Tailoring Service
**Priority**: P0  
**Estimated Time**: 3-4 hours

#### Description
Create service to generate tailored CV content.

#### Steps
1. Create CV tailoring prompt
2. Parse Gemini response into JSON Resume format
3. Validate output structure
4. Merge with original profile data
5. Handle generation failures

#### Acceptance Criteria
- [ ] Generates valid JSON Resume structure
- [ ] Tailors content to job description
- [ ] Maintains truthfulness (no fabrication)
- [ ] Handles errors gracefully

#### Files to Create
```
backend/internal/services/ai/
└── tailor.go               # CV tailoring logic
```

---

### 1D.5: Backend - AI API Handlers
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create REST API handlers for AI operations.

#### Steps
1. POST /api/ai/analyze-job - Analyze job description
2. POST /api/ai/generate-cv - Generate tailored CV
3. Add credit check before AI operations
4. Decrement credits after successful generation

#### Acceptance Criteria
- [ ] Endpoints require authentication
- [ ] Credits checked before operation
- [ ] Credits decremented on success
- [ ] Returns 402 when out of credits

#### Files to Create
```
backend/internal/handlers/
└── ai.go                   # AI handlers
```

#### API Specification
```json
// POST /api/ai/analyze-job
// Request
{
  "job_description": "We are looking for a Senior Software Engineer..."
}

// Response
{
  "match_score": 85,
  "matching_skills": ["Go", "PostgreSQL", "REST APIs"],
  "missing_skills": ["Kubernetes"],
  "suggestions": ["Highlight distributed systems experience"],
  "keywords_to_include": ["microservices", "scalability"]
}

// POST /api/ai/generate-cv
// Request
{
  "job_description": "...",
  "cv_name": "Senior Engineer at Company"
}

// Response
{
  "cv": { /* full CV object with tailored JSON Resume data */ },
  "analysis": { /* job analysis */ },
  "credits_remaining": 7
}
```

---

### 1D.6: Backend - Credits Integration
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Integrate credit checking with AI operations.

#### Steps
1. Check credits before AI operation
2. Decrement on successful generation
3. Return remaining credits in response
4. Add credits endpoint for checking balance

#### Acceptance Criteria
- [ ] Credits checked before AI calls
- [ ] 402 returned when out of credits
- [ ] Credits decremented only on success
- [ ] Can query remaining credits

#### API Endpoint
```
GET /api/credits
{
  "free_generations_used": 3,
  "free_generations_limit": 10,
  "remaining": 7
}
```

---

### 1D.7: Frontend - Job Input Form
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Create form for entering job description.

#### Steps
1. Create multi-line textarea for job description
2. Add placeholder with guidance
3. Show character count
4. Add analyze button
5. Handle loading state

#### Acceptance Criteria
- [ ] Large textarea for job description
- [ ] Clear instructions for user
- [ ] Loading indicator during analysis

#### Files to Create
```
frontend/src/components/cv/
└── JobInputForm.tsx
```

---

### 1D.8: Frontend - AI Analysis Display
**Priority**: P0  
**Estimated Time**: 2-3 hours

#### Description
Display AI analysis results to user.

#### Steps
1. Create match score visualization (gauge/percentage)
2. Display matching skills (green badges)
3. Display missing skills (gray badges)
4. Show suggestions as list
5. Display keywords to include

#### Acceptance Criteria
- [ ] Match score clearly visible
- [ ] Skills categorized visually
- [ ] Suggestions actionable
- [ ] Keywords highlighted

#### Files to Create
```
frontend/src/components/cv/
├── MatchScore.tsx
├── SkillsAnalysis.tsx
└── SuggestionsPanel.tsx
```

---

### 1D.9: Frontend - AI CV Generation Flow
**Priority**: P0  
**Estimated Time**: 3-4 hours

#### Description
Implement the full flow for generating tailored CV.

#### Steps
1. Update New CV page with "Tailored" option
2. Step 1: Enter job description
3. Step 2: Review analysis
4. Step 3: Generate CV
5. Step 4: Review and edit
6. Show remaining credits

#### Acceptance Criteria
- [ ] Clear step-by-step flow
- [ ] Analysis shown before generation
- [ ] User can proceed or cancel
- [ ] Generated CV opens in editor
- [ ] Credits updated

#### Files to Modify
```
frontend/src/routes/cv/
└── new.tsx                 # Add tailored flow
```

---

### 1D.10: Frontend - Credits Display
**Priority**: P0  
**Estimated Time**: 1-2 hours

#### Description
Show users their remaining free generations.

#### Steps
1. Create credits hook
2. Display in header or dashboard
3. Show warning when low
4. Show message when depleted

#### Acceptance Criteria
- [ ] Credits visible to user
- [ ] Warning when < 3 remaining
- [ ] Clear message when 0

#### Files to Create
```
frontend/src/hooks/
└── useCredits.ts

frontend/src/components/
└── CreditsDisplay.tsx
```

---

### 1D.11: Frontend - Loading States for AI
**Priority**: P1  
**Estimated Time**: 1-2 hours

#### Description
Create engaging loading states for AI operations.

#### Steps
1. Create skeleton loaders for analysis
2. Add progress messages ("Analyzing job...", "Generating CV...")
3. Estimated time indicator
4. Cancel option for long operations

#### Acceptance Criteria
- [ ] Loading states are informative
- [ ] User knows what's happening
- [ ] Can cancel if needed

---

### 1D.12: Error Handling for AI
**Priority**: P1  
**Estimated Time**: 1-2 hours

#### Description
Handle AI-specific errors gracefully.

#### Error Types
1. Rate limit exceeded
2. API timeout
3. Invalid response format
4. Out of credits
5. Generic API errors

#### Acceptance Criteria
- [ ] Specific error messages for each type
- [ ] Retry option where appropriate
- [ ] User not left in broken state

---

## Prompt Templates

### Job Analysis Prompt
```
You are a career advisor analyzing job fit. Compare the candidate's profile with the job requirements.

Candidate Profile (JSON Resume format):
{profile_json}

Job Description:
{job_description}

Analyze and return JSON only (no markdown):
{
  "match_score": <0-100>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "relevant_experiences": ["description of relevant experience"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "keywords_to_include": ["keyword1", "keyword2"]
}
```

### CV Tailoring Prompt
```
You are an expert resume writer. Create a tailored resume based on the candidate's master profile and the target job.

Master Profile:
{profile_json}

Target Job Description:
{job_description}

Job Analysis:
{analysis_json}

Create a tailored JSON Resume that:
1. Reorders sections to highlight most relevant experience first
2. Rewrites summary to address job requirements
3. Adjusts work experience highlights to emphasize relevant accomplishments
4. Prioritizes relevant skills
5. CRITICAL: Do not invent or fabricate any experience, education, or skills
6. Quantify achievements where data exists in the original profile

Return ONLY valid JSON in JSON Resume format (no markdown code blocks).
```

---

## Testing Checklist

### API Testing
```bash
# Analyze job
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"job_description": "Senior Software Engineer at Google..."}' \
  http://localhost:8080/api/ai/analyze-job

# Generate CV
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"job_description": "...", "cv_name": "Google SWE"}' \
  http://localhost:8080/api/ai/generate-cv

# Check credits
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/credits
```

### Manual Testing
- [ ] Enter job description and analyze
- [ ] View analysis results
- [ ] Generate tailored CV
- [ ] Verify CV content is relevant
- [ ] Verify credits decrement
- [ ] Test with 0 credits (should block)
- [ ] Test with various job descriptions

### AI Quality Testing
- [ ] Analysis match score reasonable
- [ ] Suggestions are actionable
- [ ] Generated CV is truthful
- [ ] Generated CV follows JSON Resume schema
- [ ] Generated CV emphasizes relevant experience

---

## Definition of Done

Phase 1D is complete when:
- [ ] Job analysis returns meaningful results
- [ ] CV generation produces quality tailored content
- [ ] Credits system working correctly
- [ ] User flow is smooth and intuitive
- [ ] Error handling covers edge cases
- [ ] AI responses are consistent and useful
