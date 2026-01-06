// Package profile provides the profile service for managing master profiles
package profile

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	"cv-gen/backend/internal/db"
	"cv-gen/backend/internal/models"
)

var (
	// ErrNotFound is returned when a profile is not found
	ErrNotFound = errors.New("profile not found")
	// ErrInvalidSection is returned when an invalid section name is provided
	ErrInvalidSection = errors.New("invalid section name")
	// ErrInvalidData is returned when invalid JSON Resume data is provided
	ErrInvalidData = errors.New("invalid resume data")
)

// Service provides profile management operations
type Service struct {
	queries *db.Queries
}

// New creates a new profile service
func New(queries *db.Queries) *Service {
	return &Service{
		queries: queries,
	}
}

// ProfileResponse represents the API response for profile operations
type ProfileResponse struct {
	ID         string             `json:"id"`
	UserID     string             `json:"user_id"`
	ResumeData *models.JSONResume `json:"resume_data"`
	CreatedAt  string             `json:"created_at"`
	UpdatedAt  string             `json:"updated_at"`
}

// GetProfile retrieves a user's profile
// Returns the profile if found, or an empty profile structure if not
func (s *Service) GetProfile(ctx context.Context, userID string) (*ProfileResponse, error) {
	profile, err := s.queries.GetMasterProfile(ctx, userID)
	if err != nil {
		// Return empty profile if not found
		return &ProfileResponse{
			UserID:     userID,
			ResumeData: models.EmptyJSONResume(),
		}, nil
	}

	// Parse the resume data
	var resumeData models.JSONResume
	if len(profile.ResumeData) > 0 {
		if err := json.Unmarshal(profile.ResumeData, &resumeData); err != nil {
			return nil, fmt.Errorf("failed to parse resume data: %w", err)
		}
	}

	return &ProfileResponse{
		ID:         uuidToString(profile.ID),
		UserID:     profile.UserID,
		ResumeData: &resumeData,
		CreatedAt:  timestampToString(profile.CreatedAt),
		UpdatedAt:  timestampToString(profile.UpdatedAt),
	}, nil
}

// CreateOrUpdateProfile creates or updates a user's entire profile
func (s *Service) CreateOrUpdateProfile(ctx context.Context, userID string, data *models.JSONResume) (*ProfileResponse, error) {
	// Validate the data
	if err := ValidateJSONResume(data); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidData, err)
	}

	// Marshal the data
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal resume data: %w", err)
	}

	// Upsert the profile
	profile, err := s.queries.UpsertMasterProfile(ctx, db.UpsertMasterProfileParams{
		UserID:     userID,
		ResumeData: jsonData,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to save profile: %w", err)
	}

	return &ProfileResponse{
		ID:         uuidToString(profile.ID),
		UserID:     profile.UserID,
		ResumeData: data,
		CreatedAt:  timestampToString(profile.CreatedAt),
		UpdatedAt:  timestampToString(profile.UpdatedAt),
	}, nil
}

// UpdateSection updates a specific section of the user's profile
func (s *Service) UpdateSection(ctx context.Context, userID string, section string, sectionData json.RawMessage) (*ProfileResponse, error) {
	// Validate section name
	if !models.IsValidSection(section) {
		return nil, ErrInvalidSection
	}

	// Get existing profile or create empty one
	existing, err := s.GetProfile(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Ensure we have a valid resume data structure
	if existing.ResumeData == nil {
		existing.ResumeData = models.EmptyJSONResume()
	}

	// Update the specific section
	if err := updateResumeSection(existing.ResumeData, section, sectionData); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidData, err)
	}

	// Save the updated profile
	return s.CreateOrUpdateProfile(ctx, userID, existing.ResumeData)
}

// DeleteProfile deletes a user's profile
func (s *Service) DeleteProfile(ctx context.Context, userID string) error {
	return s.queries.DeleteMasterProfile(ctx, userID)
}

// updateResumeSection updates a specific section of a JSONResume struct
func updateResumeSection(resume *models.JSONResume, section string, data json.RawMessage) error {
	switch section {
	case "basics":
		var basics models.Basics
		if err := json.Unmarshal(data, &basics); err != nil {
			return fmt.Errorf("invalid basics data: %w", err)
		}
		resume.Basics = &basics
	case "work":
		var work []models.Work
		if err := json.Unmarshal(data, &work); err != nil {
			return fmt.Errorf("invalid work data: %w", err)
		}
		resume.Work = work
	case "volunteer":
		var volunteer []models.Volunteer
		if err := json.Unmarshal(data, &volunteer); err != nil {
			return fmt.Errorf("invalid volunteer data: %w", err)
		}
		resume.Volunteer = volunteer
	case "education":
		var education []models.Education
		if err := json.Unmarshal(data, &education); err != nil {
			return fmt.Errorf("invalid education data: %w", err)
		}
		resume.Education = education
	case "awards":
		var awards []models.Award
		if err := json.Unmarshal(data, &awards); err != nil {
			return fmt.Errorf("invalid awards data: %w", err)
		}
		resume.Awards = awards
	case "certificates":
		var certificates []models.Certificate
		if err := json.Unmarshal(data, &certificates); err != nil {
			return fmt.Errorf("invalid certificates data: %w", err)
		}
		resume.Certificates = certificates
	case "publications":
		var publications []models.Publication
		if err := json.Unmarshal(data, &publications); err != nil {
			return fmt.Errorf("invalid publications data: %w", err)
		}
		resume.Publications = publications
	case "skills":
		var skills []models.Skill
		if err := json.Unmarshal(data, &skills); err != nil {
			return fmt.Errorf("invalid skills data: %w", err)
		}
		resume.Skills = skills
	case "languages":
		var languages []models.Language
		if err := json.Unmarshal(data, &languages); err != nil {
			return fmt.Errorf("invalid languages data: %w", err)
		}
		resume.Languages = languages
	case "interests":
		var interests []models.Interest
		if err := json.Unmarshal(data, &interests); err != nil {
			return fmt.Errorf("invalid interests data: %w", err)
		}
		resume.Interests = interests
	case "references":
		var references []models.Reference
		if err := json.Unmarshal(data, &references); err != nil {
			return fmt.Errorf("invalid references data: %w", err)
		}
		resume.References = references
	case "projects":
		var projects []models.Project
		if err := json.Unmarshal(data, &projects); err != nil {
			return fmt.Errorf("invalid projects data: %w", err)
		}
		resume.Projects = projects
	default:
		return fmt.Errorf("unknown section: %s", section)
	}
	return nil
}

// Helper functions

func uuidToString(id pgtype.UUID) string {
	if !id.Valid {
		return ""
	}
	// Format UUID bytes as string
	b := id.Bytes
	return fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}

func timestampToString(ts pgtype.Timestamptz) string {
	if !ts.Valid {
		return ""
	}
	return ts.Time.Format(time.RFC3339)
}
