package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"

	appMiddleware "cv-gen/backend/internal/middleware"
	cvSvc "cv-gen/backend/internal/services/cv"
)

// ListCVs returns all CVs for the authenticated user
// GET /api/cvs
func (h *Handler) ListCVs(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	// Parse pagination params
	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}
	pageSize, _ := strconv.Atoi(c.QueryParam("page_size"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	result, err := h.CVService.ListCVs(c.Request().Context(), userID, page, pageSize)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to list cvs")
	}

	return c.JSON(http.StatusOK, result)
}

// GetCV returns a specific CV by ID
// GET /api/cvs/:id
func (h *Handler) GetCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	cvID := c.Param("id")
	if cvID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cv id is required")
	}

	cv, err := h.CVService.GetCV(c.Request().Context(), userID, cvID)
	if err != nil {
		if errors.Is(err, cvSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cv not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get cv")
	}

	return c.JSON(http.StatusOK, cv)
}

// CreateCV creates a new CV from the user's master profile
// POST /api/cvs
func (h *Handler) CreateCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	var input cvSvc.CreateCVInput
	if err := c.Bind(&input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	cv, err := h.CVService.CreateCV(c.Request().Context(), userID, input)
	if err != nil {
		if errors.Is(err, cvSvc.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to create cv")
	}

	return c.JSON(http.StatusCreated, cv)
}

// UpdateCV updates a CV
// PUT /api/cvs/:id
func (h *Handler) UpdateCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	cvID := c.Param("id")
	if cvID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cv id is required")
	}

	var input cvSvc.UpdateCVInput
	if err := c.Bind(&input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	cv, err := h.CVService.UpdateCV(c.Request().Context(), userID, cvID, input)
	if err != nil {
		if errors.Is(err, cvSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cv not found")
		}
		if errors.Is(err, cvSvc.ErrInvalidData) {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to update cv")
	}

	return c.JSON(http.StatusOK, cv)
}

// DeleteCV deletes a CV
// DELETE /api/cvs/:id
func (h *Handler) DeleteCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	cvID := c.Param("id")
	if cvID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cv id is required")
	}

	err = h.CVService.DeleteCV(c.Request().Context(), userID, cvID)
	if err != nil {
		if errors.Is(err, cvSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cv not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to delete cv")
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "cv deleted successfully",
	})
}

// DuplicateCV creates a copy of an existing CV
// POST /api/cvs/:id/duplicate
func (h *Handler) DuplicateCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.CVService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "database not connected")
	}

	cvID := c.Param("id")
	if cvID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "cv id is required")
	}

	cv, err := h.CVService.DuplicateCV(c.Request().Context(), userID, cvID)
	if err != nil {
		if errors.Is(err, cvSvc.ErrNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "cv not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to duplicate cv")
	}

	return c.JSON(http.StatusCreated, cv)
}
