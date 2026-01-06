package handlers

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	appMiddleware "cv-gen/backend/internal/middleware"
	coverletterSvc "cv-gen/backend/internal/services/coverletter"
)

// CoverLetterHandler holds dependencies for cover letter handlers
type CoverLetterHandler struct {
	service *coverletterSvc.Service
}

// NewCoverLetterHandler creates a new cover letter handler
func NewCoverLetterHandler(service *coverletterSvc.Service) *CoverLetterHandler {
	return &CoverLetterHandler{
		service: service,
	}
}

// ListCoverLetters handles GET /api/cover-letters
func (h *CoverLetterHandler) ListCoverLetters(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.service == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "cover letter service not available")
	}

	coverLetters, err := h.service.ListCoverLetters(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to list cover letters")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"cover_letters": coverLetters,
	})
}

// GetCoverLetter handles GET /api/cover-letters/:id
func (h *CoverLetterHandler) GetCoverLetter(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.service == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "cover letter service not available")
	}

	coverLetterID := c.Param("id")
	if coverLetterID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cover letter id is required")
	}

	coverLetter, err := h.service.GetCoverLetter(c.Request().Context(), userID, coverLetterID)
	if err != nil {
		if errors.Is(err, coverletterSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cover letter not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get cover letter")
	}

	return c.JSON(http.StatusOK, coverLetter)
}

// CreateCoverLetter handles POST /api/cover-letters
func (h *CoverLetterHandler) CreateCoverLetter(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.service == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "cover letter service not available")
	}

	var input coverletterSvc.CreateCoverLetterInput
	if err := c.Bind(&input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	if input.Content == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "content is required")
	}

	coverLetter, err := h.service.CreateCoverLetter(c.Request().Context(), userID, input)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create cover letter")
	}

	return c.JSON(http.StatusCreated, coverLetter)
}

// UpdateCoverLetter handles PUT /api/cover-letters/:id
func (h *CoverLetterHandler) UpdateCoverLetter(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.service == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "cover letter service not available")
	}

	coverLetterID := c.Param("id")
	if coverLetterID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cover letter id is required")
	}

	var input coverletterSvc.UpdateCoverLetterInput
	if err := c.Bind(&input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	if input.Content == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "content is required")
	}

	coverLetter, err := h.service.UpdateCoverLetter(c.Request().Context(), userID, coverLetterID, input)
	if err != nil {
		if errors.Is(err, coverletterSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cover letter not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update cover letter")
	}

	return c.JSON(http.StatusOK, coverLetter)
}

// DeleteCoverLetter handles DELETE /api/cover-letters/:id
func (h *CoverLetterHandler) DeleteCoverLetter(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.service == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "cover letter service not available")
	}

	coverLetterID := c.Param("id")
	if coverLetterID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cover letter id is required")
	}

	err = h.service.DeleteCoverLetter(c.Request().Context(), userID, coverLetterID)
	if err != nil {
		if errors.Is(err, coverletterSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cover letter not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to delete cover letter")
	}

	return c.NoContent(http.StatusNoContent)
}
