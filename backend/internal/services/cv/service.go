// Package cv provides the CV service for managing generated CVs
package cv

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"cv-gen/backend/internal/db"
	"cv-gen/backend/internal/models"
)

var (
	// ErrNotFound is returned when a CV is not found
	ErrNotFound = errors.New("cv not found")
	// ErrInvalidData is returned when invalid CV data is provided
	ErrInvalidData = errors.New("invalid cv data")
	// ErrUnauthorized is returned when user doesn't own the CV
	ErrUnauthorized = errors.New("unauthorized access to cv")
)

// Service provides CV management operations
type Service struct {
	queries *db.Queries
}

// New creates a new CV service
func New(queries *db.Queries) *Service {
	return &Service{
		queries: queries,
	}
}

// CVResponse represents the API response for CV operations
type CVResponse struct {
	ID             string             `json:"id"`
	UserID         string             `json:"user_id"`
	Name           string             `json:"name"`
	CVData         *models.JSONResume `json:"cv_data"`
	TemplateID     string             `json:"template_id"`
	JobURL         string             `json:"job_url,omitempty"`
	JobTitle       string             `json:"job_title,omitempty"`
	CompanyName    string             `json:"company_name,omitempty"`
	JobDescription string             `json:"job_description,omitempty"`
	MatchScore     *int               `json:"match_score,omitempty"`
	AISuggestions  *AISuggestions     `json:"ai_suggestions,omitempty"`
	CreatedAt      string             `json:"created_at"`
	UpdatedAt      string             `json:"updated_at"`
}

// AISuggestions represents the AI analysis suggestions stored with a CV
type AISuggestions struct {
	MatchScore          int      `json:"match_score"`
	MatchingSkills      []string `json:"matching_skills"`
	MissingSkills       []string `json:"missing_skills"`
	RelevantExperiences []string `json:"relevant_experiences"`
	Suggestions         []string `json:"suggestions"`
	KeywordsToInclude   []string `json:"keywords_to_include"`
}

// CVListItem represents a CV in list responses (without full cv_data)
type CVListItem struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Name        string `json:"name"`
	TemplateID  string `json:"template_id"`
	JobTitle    string `json:"job_title,omitempty"`
	CompanyName string `json:"company_name,omitempty"`
	MatchScore  *int   `json:"match_score,omitempty"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// ListResponse represents a paginated list response
type ListResponse struct {
	CVs        []CVListItem `json:"cvs"`
	Total      int64        `json:"total"`
	Page       int          `json:"page"`
	PageSize   int          `json:"page_size"`
	TotalPages int          `json:"total_pages"`
}

// CreateCVInput represents input for creating a new CV
type CreateCVInput struct {
	Name       string `json:"name"`
	TemplateID string `json:"template_id"`
}

// UpdateCVInput represents input for updating a CV
type UpdateCVInput struct {
	Name       *string            `json:"name,omitempty"`
	CVData     *models.JSONResume `json:"cv_data,omitempty"`
	TemplateID *string            `json:"template_id,omitempty"`
}

// ListCVs returns all CVs for a user with pagination
func (s *Service) ListCVs(ctx context.Context, userID string, page, pageSize int) (*ListResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	offset := int32((page - 1) * pageSize)

	// Get total count
	total, err := s.queries.CountCVsByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to count cvs: %w", err)
	}

	// Get paginated list
	cvs, err := s.queries.ListCVsByUserPaginated(ctx, db.ListCVsByUserPaginatedParams{
		UserID: userID,
		Limit:  int32(pageSize),
		Offset: offset,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to list cvs: %w", err)
	}

	items := make([]CVListItem, 0, len(cvs))
	for _, cv := range cvs {
		item := CVListItem{
			ID:          uuidToString(cv.ID),
			UserID:      cv.UserID,
			Name:        cv.Name,
			TemplateID:  textToString(cv.TemplateID),
			JobTitle:    textToString(cv.JobTitle),
			CompanyName: textToString(cv.CompanyName),
			CreatedAt:   timestampToString(cv.CreatedAt),
			UpdatedAt:   timestampToString(cv.UpdatedAt),
		}
		if cv.MatchScore.Valid {
			score := int(cv.MatchScore.Int32)
			item.MatchScore = &score
		}
		items = append(items, item)
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &ListResponse{
		CVs:        items,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

// GetCV retrieves a specific CV by ID
func (s *Service) GetCV(ctx context.Context, userID, cvID string) (*CVResponse, error) {
	uuid, err := parseUUID(cvID)
	if err != nil {
		return nil, ErrNotFound
	}

	cv, err := s.queries.GetCVByUserAndId(ctx, db.GetCVByUserAndIdParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get cv: %w", err)
	}

	return cvToResponse(cv)
}

// CreateCV creates a new CV from the user's master profile
func (s *Service) CreateCV(ctx context.Context, userID string, input CreateCVInput) (*CVResponse, error) {
	// Set defaults
	name := input.Name
	if name == "" {
		name = "Untitled CV"
	}
	templateID := input.TemplateID
	if templateID == "" {
		templateID = "professional"
	}

	// Get user's master profile to copy data from
	profile, err := s.queries.GetMasterProfile(ctx, userID)
	var cvData []byte
	if err != nil {
		// No profile exists, use empty resume
		emptyResume := models.EmptyJSONResume()
		cvData, _ = json.Marshal(emptyResume)
	} else {
		// Copy from master profile
		cvData = profile.ResumeData
	}

	// Create the CV
	cv, err := s.queries.CreateCV(ctx, db.CreateCVParams{
		UserID:         userID,
		Name:           name,
		CvData:         cvData,
		TemplateID:     pgtype.Text{String: templateID, Valid: true},
		JobUrl:         pgtype.Text{Valid: false},
		JobTitle:       pgtype.Text{Valid: false},
		CompanyName:    pgtype.Text{Valid: false},
		JobDescription: pgtype.Text{Valid: false},
		MatchScore:     pgtype.Int4{Valid: false},
		AiSuggestions:  []byte("[]"),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create cv: %w", err)
	}

	return cvToResponse(cv)
}

// UpdateCV updates a CV
func (s *Service) UpdateCV(ctx context.Context, userID, cvID string, input UpdateCVInput) (*CVResponse, error) {
	uuid, err := parseUUID(cvID)
	if err != nil {
		return nil, ErrNotFound
	}

	// Build update params - fields left as zero value (Valid: false) will preserve existing values via COALESCE
	params := db.UpdateCVParams{
		ID:     uuid,
		UserID: userID,
		// Name, CvData, TemplateID left as zero values - SQL COALESCE will preserve existing
	}

	if input.Name != nil {
		params.Name = pgtype.Text{String: *input.Name, Valid: true}
	}

	if input.CVData != nil {
		cvData, err := json.Marshal(input.CVData)
		if err != nil {
			return nil, fmt.Errorf("%w: failed to marshal cv data", ErrInvalidData)
		}
		params.CvData = cvData
	}

	if input.TemplateID != nil {
		params.TemplateID = pgtype.Text{String: *input.TemplateID, Valid: true}
	}

	cv, err := s.queries.UpdateCV(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to update cv: %w", err)
	}

	return cvToResponse(cv)
}

// DeleteCV deletes a CV
func (s *Service) DeleteCV(ctx context.Context, userID, cvID string) error {
	uuid, err := parseUUID(cvID)
	if err != nil {
		return ErrNotFound
	}

	// First check if CV exists and belongs to user
	_, err = s.queries.GetCVByUserAndId(ctx, db.GetCVByUserAndIdParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return fmt.Errorf("failed to get cv: %w", err)
	}

	err = s.queries.DeleteCV(ctx, db.DeleteCVParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete cv: %w", err)
	}

	return nil
}

// DuplicateCV creates a copy of an existing CV
func (s *Service) DuplicateCV(ctx context.Context, userID, cvID string) (*CVResponse, error) {
	uuid, err := parseUUID(cvID)
	if err != nil {
		return nil, ErrNotFound
	}

	// Get the original CV
	original, err := s.queries.GetCVByUserAndId(ctx, db.GetCVByUserAndIdParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get cv: %w", err)
	}

	// Create a duplicate
	cv, err := s.queries.CreateCV(ctx, db.CreateCVParams{
		UserID:         userID,
		Name:           original.Name + " (Copy)",
		CvData:         original.CvData,
		TemplateID:     original.TemplateID,
		JobUrl:         original.JobUrl,
		JobTitle:       original.JobTitle,
		CompanyName:    original.CompanyName,
		JobDescription: original.JobDescription,
		MatchScore:     pgtype.Int4{Valid: false}, // Reset match score for copy
		AiSuggestions:  []byte("[]"),              // Reset AI suggestions for copy
	})
	if err != nil {
		return nil, fmt.Errorf("failed to duplicate cv: %w", err)
	}

	return cvToResponse(cv)
}

// Helper functions

func cvToResponse(cv db.GeneratedCv) (*CVResponse, error) {
	var cvData models.JSONResume
	if len(cv.CvData) > 0 {
		if err := json.Unmarshal(cv.CvData, &cvData); err != nil {
			return nil, fmt.Errorf("failed to parse cv data: %w", err)
		}
	}

	resp := &CVResponse{
		ID:             uuidToString(cv.ID),
		UserID:         cv.UserID,
		Name:           cv.Name,
		CVData:         &cvData,
		TemplateID:     textToString(cv.TemplateID),
		JobURL:         textToString(cv.JobUrl),
		JobTitle:       textToString(cv.JobTitle),
		CompanyName:    textToString(cv.CompanyName),
		JobDescription: textToString(cv.JobDescription),
		CreatedAt:      timestampToString(cv.CreatedAt),
		UpdatedAt:      timestampToString(cv.UpdatedAt),
	}

	if cv.MatchScore.Valid {
		score := int(cv.MatchScore.Int32)
		resp.MatchScore = &score
	}

	// Parse AI suggestions if available
	if len(cv.AiSuggestions) > 0 && string(cv.AiSuggestions) != "[]" {
		var aiSuggestions AISuggestions
		if err := json.Unmarshal(cv.AiSuggestions, &aiSuggestions); err == nil {
			// Only include if there's meaningful data
			if aiSuggestions.MatchScore > 0 || len(aiSuggestions.Suggestions) > 0 {
				resp.AISuggestions = &aiSuggestions
			}
		}
	}

	return resp, nil
}

func uuidToString(id pgtype.UUID) string {
	if !id.Valid {
		return ""
	}
	b := id.Bytes
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

func parseUUID(s string) (pgtype.UUID, error) {
	var uuid pgtype.UUID
	err := uuid.Scan(s)
	return uuid, err
}

func textToString(t pgtype.Text) string {
	if !t.Valid {
		return ""
	}
	return t.String
}

func timestampToString(ts pgtype.Timestamptz) string {
	if !ts.Valid {
		return ""
	}
	return ts.Time.Format(time.RFC3339)
}
