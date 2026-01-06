package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	appMiddleware "cv-gen/backend/internal/middleware"
	"cv-gen/backend/internal/models"
	profileSvc "cv-gen/backend/internal/services/profile"
)

// GetProfile returns the authenticated user's profile
// GET /api/profile
func (h *Handler) GetProfile(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.ProfileService == nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"user_id":     userID,
			"resume_data": models.EmptyJSONResume(),
		})
	}

	profile, err := h.ProfileService.GetProfile(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get profile")
	}

	return c.JSON(http.StatusOK, profile)
}

// UpdateProfile replaces the entire profile for the authenticated user
// PUT /api/profile
func (h *Handler) UpdateProfile(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.ProfileService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	// Parse the request body
	var req UpdateProfileRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	// Validate we have data
	if req.ResumeData == nil {
		return echo.NewHTTPError(http.StatusBadRequest, "resume_data is required")
	}

	profile, err := h.ProfileService.CreateOrUpdateProfile(c.Request().Context(), userID, req.ResumeData)
	if err != nil {
		if errors.Is(err, profileSvc.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update profile")
	}

	return c.JSON(http.StatusOK, profile)
}

// UpdateProfileSection updates a specific section of the profile
// PATCH /api/profile/:section
func (h *Handler) UpdateProfileSection(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.ProfileService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	section := c.Param("section")
	if section == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "section parameter is required")
	}

	// Read raw body for the section data
	var sectionData json.RawMessage
	if err := c.Bind(&sectionData); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	profile, err := h.ProfileService.UpdateSection(c.Request().Context(), userID, section, sectionData)
	if err != nil {
		if errors.Is(err, profileSvc.ErrInvalidSection) {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid section: "+section)
		}
		if errors.Is(err, profileSvc.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update section")
	}

	return c.JSON(http.StatusOK, profile)
}

// DeleteProfile deletes the authenticated user's profile
// DELETE /api/profile
func (h *Handler) DeleteProfile(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.ProfileService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	if err := h.ProfileService.DeleteProfile(c.Request().Context(), userID); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to delete profile")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "profile deleted successfully",
	})
}

// UpdateProfileRequest represents the request body for profile updates
type UpdateProfileRequest struct {
	ResumeData *models.JSONResume `json:"resume_data"`
}

// Legacy Profile handler for backward compatibility
// GET /api/profile (deprecated - use GetProfile instead)
func (h *Handler) Profile(c echo.Context) error {
	return h.GetProfile(c)
}
