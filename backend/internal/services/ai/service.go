package ai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"cv-gen/backend/internal/db"
	"cv-gen/backend/internal/models"

	"github.com/jackc/pgx/v5/pgtype"
)

var (
	// ErrOutOfCredits is returned when the user has no remaining credits
	ErrOutOfCredits = errors.New("out of generation credits")
	// ErrProfileNotFound is returned when the user has no profile
	ErrProfileNotFound = errors.New("profile not found")
	// ErrEmptyJobDescription is returned when the job description is empty
	ErrEmptyJobDescription = errors.New("job description cannot be empty")
)

// Service provides AI-powered CV generation and job analysis
type Service struct {
	gemini  *GeminiClient
	queries *db.Queries
}

// New creates a new AI service
func New(geminiAPIKey string, queries *db.Queries) (*Service, error) {
	gemini, err := NewGeminiClient(geminiAPIKey)
	if err != nil {
		return nil, err
	}

	return &Service{
		gemini:  gemini,
		queries: queries,
	}, nil
}

// NewWithClient creates a new AI service with an existing Gemini client (for testing)
func NewWithClient(gemini *GeminiClient, queries *db.Queries) *Service {
	return &Service{
		gemini:  gemini,
		queries: queries,
	}
}

// Close closes the AI service and its clients
func (s *Service) Close() error {
	if s.gemini != nil {
		return s.gemini.Close()
	}
	return nil
}

// AnalyzeJob analyzes a job description against the user's profile
func (s *Service) AnalyzeJob(ctx context.Context, userID string, jobDescription string) (*JobAnalysis, error) {
	if jobDescription == "" {
		return nil, ErrEmptyJobDescription
	}

	// Get user's profile
	profileJSON, err := s.getProfileJSON(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Analyze the job
	return s.gemini.AnalyzeJob(ctx, profileJSON, jobDescription)
}

// GenerateCV generates a tailored CV based on a job description
func (s *Service) GenerateCV(ctx context.Context, userID string, req *GenerateCVRequest) (*GenerateCVResponse, error) {
	if req.JobDescription == "" {
		return nil, ErrEmptyJobDescription
	}

	// Check credits
	credits, err := s.checkCredits(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Get user's profile
	profileJSON, err := s.getProfileJSON(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Analyze the job first
	analysis, err := s.gemini.AnalyzeJob(ctx, profileJSON, req.JobDescription)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze job: %w", err)
	}

	// Generate tailored CV
	tailoredCVJSON, err := s.gemini.TailorCV(ctx, profileJSON, req.JobDescription, analysis)
	if err != nil {
		return nil, fmt.Errorf("failed to generate tailored CV: %w", err)
	}

	// Parse the tailored CV
	var tailoredResume models.JSONResume
	if err := json.Unmarshal([]byte(tailoredCVJSON), &tailoredResume); err != nil {
		return nil, fmt.Errorf("%w: failed to parse tailored CV: %v", ErrInvalidResponse, err)
	}

	// Save the CV to database
	cvData, err := json.Marshal(&tailoredResume)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal CV data: %w", err)
	}

	analysisData, err := json.Marshal(analysis)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal analysis: %w", err)
	}

	cvName := req.CVName
	if cvName == "" {
		cvName = "Tailored CV"
		if req.JobTitle != "" {
			cvName = fmt.Sprintf("%s CV", req.JobTitle)
		}
	}

	savedCV, err := s.queries.CreateCV(ctx, db.CreateCVParams{
		UserID:         userID,
		Name:           cvName,
		JobUrl:         pgtype.Text{String: req.JobURL, Valid: req.JobURL != ""},
		JobTitle:       pgtype.Text{String: req.JobTitle, Valid: req.JobTitle != ""},
		CompanyName:    pgtype.Text{String: req.CompanyName, Valid: req.CompanyName != ""},
		JobDescription: pgtype.Text{String: req.JobDescription, Valid: true},
		CvData:         cvData,
		MatchScore:     pgtype.Int4{Int32: int32(analysis.MatchScore), Valid: true},
		AiSuggestions:  analysisData,
		TemplateID:     pgtype.Text{String: "professional", Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to save CV: %w", err)
	}

	// Increment credits used
	updatedCredits, err := s.queries.IncrementCreditsUsed(ctx, userID)
	if err != nil {
		// Log the error but don't fail the request since CV is already saved
		fmt.Printf("warning: failed to increment credits for user %s: %v\n", userID, err)
	}

	// Calculate remaining credits using the unified model
	remaining := calculateRemainingCredits(updatedCredits)
	if !updatedCredits.ID.Valid {
		// Fallback if update failed
		remaining = calculateRemainingCredits(credits)
		remaining-- // Account for this generation
	}

	return &GenerateCVResponse{
		CV: &CVData{
			ID:         uuidToString(savedCV.ID),
			Name:       savedCV.Name,
			ResumeData: &tailoredResume,
			MatchScore: analysis.MatchScore,
			JobTitle:   req.JobTitle,
			Company:    req.CompanyName,
			CreatedAt:  timestampToString(savedCV.CreatedAt),
		},
		Analysis:         analysis,
		CreditsRemaining: int(remaining),
	}, nil
}

// GetCredits returns the user's credit balance
func (s *Service) GetCredits(ctx context.Context, userID string) (*CreditsResponse, error) {
	credits, err := s.queries.GetOrCreateUserCredits(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get credits: %w", err)
	}

	return &CreditsResponse{
		FreeGenerationsUsed:  credits.FreeGenerationsUsed,
		FreeGenerationsLimit: credits.FreeGenerationsLimit,
		PaidCredits:          credits.PaidCredits,
		TotalGenerations:     credits.TotalGenerations,
		Remaining:            calculateRemainingCredits(credits),
	}, nil
}

// GenerateCoverLetter generates a cover letter based on profile and job details
func (s *Service) GenerateCoverLetter(ctx context.Context, userID string, req *GenerateCoverLetterRequest) (*GenerateCoverLetterResponse, error) {
	if req.JobTitle == "" || req.CompanyName == "" {
		return nil, errors.New("job_title and company_name are required")
	}

	// Check credits
	credits, err := s.checkCredits(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Get user's profile
	profileJSON, err := s.getProfileJSON(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Get job description - either from request or from linked CV
	jobDescription := req.JobDescription
	cvSummary := ""
	var cvIDPtr *string

	if req.CVID != "" {
		// Get CV to use its job description and summary
		var cvUUID pgtype.UUID
		if err := cvUUID.Scan(req.CVID); err == nil {
			cv, err := s.queries.GetCVByUserAndId(ctx, db.GetCVByUserAndIdParams{
				ID:     cvUUID,
				UserID: userID,
			})
			if err == nil {
				if jobDescription == "" && cv.JobDescription.Valid {
					jobDescription = cv.JobDescription.String
				}
				// Try to get summary from CV data
				var cvData models.JSONResume
				if json.Unmarshal(cv.CvData, &cvData) == nil && cvData.Basics != nil && cvData.Basics.Summary != "" {
					cvSummary = cvData.Basics.Summary
				}
				cvIDStr := uuidToString(cv.ID)
				cvIDPtr = &cvIDStr
			}
		}
	}

	if jobDescription == "" {
		jobDescription = fmt.Sprintf("Position: %s at %s", req.JobTitle, req.CompanyName)
	}

	// Generate cover letter
	content, err := s.gemini.GenerateCoverLetter(ctx, profileJSON, req.JobTitle, req.CompanyName, jobDescription, cvSummary)
	if err != nil {
		return nil, fmt.Errorf("failed to generate cover letter: %w", err)
	}

	// Save to database
	var cvUUID pgtype.UUID
	if req.CVID != "" {
		cvUUID.Scan(req.CVID)
	}

	savedCL, err := s.queries.CreateCoverLetter(ctx, db.CreateCoverLetterParams{
		UserID:      userID,
		CvID:        cvUUID,
		Content:     content,
		JobTitle:    pgtype.Text{String: req.JobTitle, Valid: true},
		CompanyName: pgtype.Text{String: req.CompanyName, Valid: true},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to save cover letter: %w", err)
	}

	// Increment credits used
	updatedCredits, err := s.queries.IncrementCreditsUsed(ctx, userID)
	if err != nil {
		fmt.Printf("warning: failed to increment credits for user %s: %v\n", userID, err)
	}

	remaining := calculateRemainingCredits(updatedCredits)
	if !updatedCredits.ID.Valid {
		remaining = calculateRemainingCredits(credits)
		remaining--
	}

	return &GenerateCoverLetterResponse{
		CoverLetter: &CoverLetterData{
			ID:          uuidToString(savedCL.ID),
			Content:     content,
			JobTitle:    req.JobTitle,
			CompanyName: req.CompanyName,
			CVID:        cvIDPtr,
			CreatedAt:   timestampToString(savedCL.CreatedAt),
		},
		CreditsRemaining: int(remaining),
	}, nil
}

// checkCredits verifies the user has remaining credits
func (s *Service) checkCredits(ctx context.Context, userID string) (db.UserCredit, error) {
	credits, err := s.queries.GetOrCreateUserCredits(ctx, userID)
	if err != nil {
		return db.UserCredit{}, fmt.Errorf("failed to get credits: %w", err)
	}

	// Calculate total remaining: free remaining + paid credits
	remaining := calculateRemainingCredits(credits)
	if remaining <= 0 {
		return db.UserCredit{}, ErrOutOfCredits
	}

	return credits, nil
}

// calculateRemainingCredits calculates total remaining credits (free + paid)
func calculateRemainingCredits(credits db.UserCredit) int32 {
	freeRemaining := credits.FreeGenerationsLimit - credits.FreeGenerationsUsed
	if freeRemaining < 0 {
		freeRemaining = 0
	}
	return freeRemaining + credits.PaidCredits
}

// getProfileJSON retrieves and serializes the user's profile
func (s *Service) getProfileJSON(ctx context.Context, userID string) (string, error) {
	profile, err := s.queries.GetMasterProfile(ctx, userID)
	if err != nil {
		return "", ErrProfileNotFound
	}

	// Parse the stored resume data
	var resumeData models.JSONResume
	if len(profile.ResumeData) > 0 {
		if err := json.Unmarshal(profile.ResumeData, &resumeData); err != nil {
			return "", fmt.Errorf("failed to parse profile data: %w", err)
		}
	}

	// Check if profile has meaningful content
	if resumeData.Basics == nil || resumeData.Basics.Name == "" {
		return "", ErrProfileNotFound
	}

	// Re-serialize for the AI prompt (formatted JSON)
	profileJSON, err := json.MarshalIndent(&resumeData, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to serialize profile: %w", err)
	}

	return string(profileJSON), nil
}

// Helper functions

func uuidToString(id pgtype.UUID) string {
	if !id.Valid {
		return ""
	}
	b := id.Bytes
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

func timestampToString(ts pgtype.Timestamptz) string {
	if !ts.Valid {
		return ""
	}
	return ts.Time.Format("2006-01-02T15:04:05Z07:00")
}
