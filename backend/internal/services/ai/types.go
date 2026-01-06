// Package ai provides AI-powered services for CV generation and job analysis
package ai

import "cv-gen/backend/internal/models"

// JobAnalysis represents the result of analyzing a job description against a profile
type JobAnalysis struct {
	MatchScore          int      `json:"match_score"`
	MatchingSkills      []string `json:"matching_skills"`
	MissingSkills       []string `json:"missing_skills"`
	RelevantExperiences []string `json:"relevant_experiences"`
	Suggestions         []string `json:"suggestions"`
	KeywordsToInclude   []string `json:"keywords_to_include"`
}

// AnalyzeJobRequest represents a request to analyze a job description
type AnalyzeJobRequest struct {
	JobDescription string `json:"job_description"`
}

// AnalyzeJobResponse represents the response from job analysis
type AnalyzeJobResponse struct {
	Analysis *JobAnalysis `json:"analysis"`
}

// GenerateCVRequest represents a request to generate a tailored CV
type GenerateCVRequest struct {
	JobDescription string `json:"job_description"`
	CVName         string `json:"cv_name"`
	JobTitle       string `json:"job_title,omitempty"`
	CompanyName    string `json:"company_name,omitempty"`
	JobURL         string `json:"job_url,omitempty"`
}

// GenerateCVResponse represents the response from CV generation
type GenerateCVResponse struct {
	CV               *CVData      `json:"cv"`
	Analysis         *JobAnalysis `json:"analysis"`
	CreditsRemaining int          `json:"credits_remaining"`
}

// CVData represents a generated CV
type CVData struct {
	ID         string             `json:"id"`
	Name       string             `json:"name"`
	ResumeData *models.JSONResume `json:"resume_data"`
	MatchScore int                `json:"match_score"`
	JobTitle   string             `json:"job_title,omitempty"`
	Company    string             `json:"company,omitempty"`
	CreatedAt  string             `json:"created_at"`
}

// CreditsResponse represents the user's credit balance
type CreditsResponse struct {
	FreeGenerationsUsed  int32 `json:"free_generations_used"`
	FreeGenerationsLimit int32 `json:"free_generations_limit"`
	PaidCredits          int32 `json:"paid_credits"`
	TotalGenerations     int32 `json:"total_generations"`
	Remaining            int32 `json:"remaining"`
}

// GenerateCoverLetterRequest represents a request to generate a cover letter
type GenerateCoverLetterRequest struct {
	CVID           string `json:"cv_id,omitempty"`
	JobTitle       string `json:"job_title"`
	CompanyName    string `json:"company_name"`
	JobDescription string `json:"job_description,omitempty"`
}

// GenerateCoverLetterResponse represents the response from cover letter generation
type GenerateCoverLetterResponse struct {
	CoverLetter      *CoverLetterData `json:"cover_letter"`
	CreditsRemaining int              `json:"credits_remaining"`
}

// CoverLetterData represents a generated cover letter
type CoverLetterData struct {
	ID          string  `json:"id"`
	Content     string  `json:"content"`
	JobTitle    string  `json:"job_title"`
	CompanyName string  `json:"company_name"`
	CVID        *string `json:"cv_id,omitempty"`
	CreatedAt   string  `json:"created_at"`
}
