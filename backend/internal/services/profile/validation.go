package profile

import (
	"errors"
	"net/mail"
	"net/url"
	"regexp"
	"strings"

	"cv-gen/backend/internal/models"
)

// Validation errors
var (
	ErrInvalidEmail = errors.New("invalid email format")
	ErrInvalidURL   = errors.New("invalid URL format")
	ErrInvalidPhone = errors.New("invalid phone format")
	ErrInvalidDate  = errors.New("invalid date format (expected YYYY-MM-DD)")
)

// dateRegex matches dates in YYYY-MM-DD format or YYYY-MM format
var dateRegex = regexp.MustCompile(`^\d{4}(-\d{2})?(-\d{2})?$`)

// phoneRegex is a simple phone validation (allows various formats)
var phoneRegex = regexp.MustCompile(`^[\d\s\-+().]+$`)

// ValidateJSONResume validates a JSON Resume structure
func ValidateJSONResume(resume *models.JSONResume) error {
	if resume == nil {
		return nil
	}

	// Validate basics section
	if resume.Basics != nil {
		if err := validateBasics(resume.Basics); err != nil {
			return err
		}
	}

	// Validate work entries
	for i, work := range resume.Work {
		if err := validateWork(&work, i); err != nil {
			return err
		}
	}

	// Validate education entries
	for i, edu := range resume.Education {
		if err := validateEducation(&edu, i); err != nil {
			return err
		}
	}

	// Validate volunteer entries
	for i, vol := range resume.Volunteer {
		if err := validateVolunteer(&vol, i); err != nil {
			return err
		}
	}

	// Validate projects
	for i, proj := range resume.Projects {
		if err := validateProject(&proj, i); err != nil {
			return err
		}
	}

	// Validate certificates
	for i, cert := range resume.Certificates {
		if err := validateCertificate(&cert, i); err != nil {
			return err
		}
	}

	// Validate publications
	for i, pub := range resume.Publications {
		if err := validatePublication(&pub, i); err != nil {
			return err
		}
	}

	// Validate awards
	for i, award := range resume.Awards {
		if err := validateAward(&award, i); err != nil {
			return err
		}
	}

	return nil
}

func validateBasics(basics *models.Basics) error {
	// Validate email if provided
	if basics.Email != "" {
		if _, err := mail.ParseAddress(basics.Email); err != nil {
			return ErrInvalidEmail
		}
	}

	// Validate URL if provided
	if basics.URL != "" {
		if err := validateURL(basics.URL); err != nil {
			return err
		}
	}

	// Validate phone if provided (simple validation)
	if basics.Phone != "" {
		if !phoneRegex.MatchString(basics.Phone) {
			return ErrInvalidPhone
		}
	}

	// Validate profile URLs
	for _, profile := range basics.Profiles {
		if profile.URL != "" {
			if err := validateURL(profile.URL); err != nil {
				return err
			}
		}
	}

	return nil
}

func validateWork(work *models.Work, index int) error {
	// Validate URL if provided
	if work.URL != "" {
		if err := validateURL(work.URL); err != nil {
			return err
		}
	}

	// Validate dates if provided
	if work.StartDate != "" {
		if err := validateDate(work.StartDate); err != nil {
			return err
		}
	}

	if work.EndDate != "" {
		if err := validateDate(work.EndDate); err != nil {
			return err
		}
	}

	return nil
}

func validateEducation(edu *models.Education, index int) error {
	// Validate URL if provided
	if edu.URL != "" {
		if err := validateURL(edu.URL); err != nil {
			return err
		}
	}

	// Validate dates if provided
	if edu.StartDate != "" {
		if err := validateDate(edu.StartDate); err != nil {
			return err
		}
	}

	if edu.EndDate != "" {
		if err := validateDate(edu.EndDate); err != nil {
			return err
		}
	}

	return nil
}

func validateVolunteer(vol *models.Volunteer, index int) error {
	// Validate URL if provided
	if vol.URL != "" {
		if err := validateURL(vol.URL); err != nil {
			return err
		}
	}

	// Validate dates if provided
	if vol.StartDate != "" {
		if err := validateDate(vol.StartDate); err != nil {
			return err
		}
	}

	if vol.EndDate != "" {
		if err := validateDate(vol.EndDate); err != nil {
			return err
		}
	}

	return nil
}

func validateProject(proj *models.Project, index int) error {
	// Validate URL if provided
	if proj.URL != "" {
		if err := validateURL(proj.URL); err != nil {
			return err
		}
	}

	// Validate dates if provided
	if proj.StartDate != "" {
		if err := validateDate(proj.StartDate); err != nil {
			return err
		}
	}

	if proj.EndDate != "" {
		if err := validateDate(proj.EndDate); err != nil {
			return err
		}
	}

	return nil
}

func validateCertificate(cert *models.Certificate, index int) error {
	// Validate URL if provided
	if cert.URL != "" {
		if err := validateURL(cert.URL); err != nil {
			return err
		}
	}

	// Validate date if provided
	if cert.Date != "" {
		if err := validateDate(cert.Date); err != nil {
			return err
		}
	}

	return nil
}

func validatePublication(pub *models.Publication, index int) error {
	// Validate URL if provided
	if pub.URL != "" {
		if err := validateURL(pub.URL); err != nil {
			return err
		}
	}

	// Validate date if provided
	if pub.ReleaseDate != "" {
		if err := validateDate(pub.ReleaseDate); err != nil {
			return err
		}
	}

	return nil
}

func validateAward(award *models.Award, index int) error {
	// Validate date if provided
	if award.Date != "" {
		if err := validateDate(award.Date); err != nil {
			return err
		}
	}

	return nil
}

func validateURL(rawURL string) error {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return nil
	}

	u, err := url.Parse(rawURL)
	if err != nil {
		return ErrInvalidURL
	}

	// URL must have a scheme
	if u.Scheme == "" || u.Host == "" {
		return ErrInvalidURL
	}

	return nil
}

func validateDate(date string) error {
	date = strings.TrimSpace(date)
	if date == "" {
		return nil
	}

	if !dateRegex.MatchString(date) {
		return ErrInvalidDate
	}

	return nil
}
