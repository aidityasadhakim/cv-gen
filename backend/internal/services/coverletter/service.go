// Package coverletter provides cover letter generation and management
package coverletter

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

	"cv-gen/backend/internal/db"
)

var (
	// ErrNotFound is returned when a cover letter is not found
	ErrNotFound = errors.New("cover letter not found")
	// ErrInvalidData is returned when invalid data is provided
	ErrInvalidData = errors.New("invalid cover letter data")
	// ErrUnauthorized is returned when user doesn't own the cover letter
	ErrUnauthorized = errors.New("unauthorized access to cover letter")
)

// Service provides cover letter management operations
type Service struct {
	queries *db.Queries
}

// New creates a new cover letter service
func New(queries *db.Queries) *Service {
	return &Service{
		queries: queries,
	}
}

// CoverLetterResponse represents the API response for cover letter operations
type CoverLetterResponse struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	CVID        *string `json:"cv_id,omitempty"`
	Content     string  `json:"content"`
	JobTitle    string  `json:"job_title,omitempty"`
	CompanyName string  `json:"company_name,omitempty"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

// CoverLetterListItem represents a cover letter in list responses
type CoverLetterListItem struct {
	ID          string  `json:"id"`
	UserID      string  `json:"user_id"`
	CVID        *string `json:"cv_id,omitempty"`
	JobTitle    string  `json:"job_title,omitempty"`
	CompanyName string  `json:"company_name,omitempty"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
}

// CreateCoverLetterInput represents input for creating a cover letter
type CreateCoverLetterInput struct {
	CVID        string `json:"cv_id,omitempty"`
	Content     string `json:"content"`
	JobTitle    string `json:"job_title,omitempty"`
	CompanyName string `json:"company_name,omitempty"`
}

// UpdateCoverLetterInput represents input for updating a cover letter
type UpdateCoverLetterInput struct {
	Content string `json:"content"`
}

// ListCoverLetters returns all cover letters for a user
func (s *Service) ListCoverLetters(ctx context.Context, userID string) ([]CoverLetterListItem, error) {
	coverLetters, err := s.queries.ListCoverLettersByUser(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list cover letters: %w", err)
	}

	items := make([]CoverLetterListItem, 0, len(coverLetters))
	for _, cl := range coverLetters {
		item := CoverLetterListItem{
			ID:          uuidToString(cl.ID),
			UserID:      cl.UserID,
			JobTitle:    textToString(cl.JobTitle),
			CompanyName: textToString(cl.CompanyName),
			CreatedAt:   timestampToString(cl.CreatedAt),
			UpdatedAt:   timestampToString(cl.UpdatedAt),
		}
		if cl.CvID.Valid {
			cvID := uuidToString(cl.CvID)
			item.CVID = &cvID
		}
		items = append(items, item)
	}

	return items, nil
}

// GetCoverLetter retrieves a specific cover letter by ID
func (s *Service) GetCoverLetter(ctx context.Context, userID, coverLetterID string) (*CoverLetterResponse, error) {
	uuid, err := parseUUID(coverLetterID)
	if err != nil {
		return nil, ErrNotFound
	}

	cl, err := s.queries.GetCoverLetterByUserAndId(ctx, db.GetCoverLetterByUserAndIdParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get cover letter: %w", err)
	}

	return coverLetterToResponse(cl), nil
}

// CreateCoverLetter creates a new cover letter
func (s *Service) CreateCoverLetter(ctx context.Context, userID string, input CreateCoverLetterInput) (*CoverLetterResponse, error) {
	params := db.CreateCoverLetterParams{
		UserID:      userID,
		Content:     input.Content,
		JobTitle:    pgtype.Text{String: input.JobTitle, Valid: input.JobTitle != ""},
		CompanyName: pgtype.Text{String: input.CompanyName, Valid: input.CompanyName != ""},
	}

	// Parse CV ID if provided
	if input.CVID != "" {
		cvUUID, err := parseUUID(input.CVID)
		if err == nil {
			params.CvID = cvUUID
		}
	}

	cl, err := s.queries.CreateCoverLetter(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create cover letter: %w", err)
	}

	return coverLetterToResponse(cl), nil
}

// UpdateCoverLetter updates a cover letter's content
func (s *Service) UpdateCoverLetter(ctx context.Context, userID, coverLetterID string, input UpdateCoverLetterInput) (*CoverLetterResponse, error) {
	uuid, err := parseUUID(coverLetterID)
	if err != nil {
		return nil, ErrNotFound
	}

	cl, err := s.queries.UpdateCoverLetter(ctx, db.UpdateCoverLetterParams{
		ID:      uuid,
		UserID:  userID,
		Content: input.Content,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to update cover letter: %w", err)
	}

	return coverLetterToResponse(cl), nil
}

// DeleteCoverLetter deletes a cover letter
func (s *Service) DeleteCoverLetter(ctx context.Context, userID, coverLetterID string) error {
	uuid, err := parseUUID(coverLetterID)
	if err != nil {
		return ErrNotFound
	}

	// First check if cover letter exists and belongs to user
	_, err = s.queries.GetCoverLetterByUserAndId(ctx, db.GetCoverLetterByUserAndIdParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrNotFound
		}
		return fmt.Errorf("failed to get cover letter: %w", err)
	}

	err = s.queries.DeleteCoverLetter(ctx, db.DeleteCoverLetterParams{
		ID:     uuid,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete cover letter: %w", err)
	}

	return nil
}

// Helper functions

func coverLetterToResponse(cl db.CoverLetter) *CoverLetterResponse {
	resp := &CoverLetterResponse{
		ID:          uuidToString(cl.ID),
		UserID:      cl.UserID,
		Content:     cl.Content,
		JobTitle:    textToString(cl.JobTitle),
		CompanyName: textToString(cl.CompanyName),
		CreatedAt:   timestampToString(cl.CreatedAt),
		UpdatedAt:   timestampToString(cl.UpdatedAt),
	}
	if cl.CvID.Valid {
		cvID := uuidToString(cl.CvID)
		resp.CVID = &cvID
	}
	return resp
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
