package handlers

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"

	appMiddleware "cv-gen/backend/internal/middleware"
	"cv-gen/backend/internal/services/ai"
)

// AIHandler holds dependencies for AI-related handlers
type AIHandler struct {
	aiService *ai.Service
}

// NewAIHandler creates a new AI handler
func NewAIHandler(aiService *ai.Service) *AIHandler {
	return &AIHandler{
		aiService: aiService,
	}
}

// AnalyzeJob handles POST /api/ai/analyze-job
func (h *AIHandler) AnalyzeJob(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.aiService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "AI service not available")
	}

	var req ai.AnalyzeJobRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	if req.JobDescription == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "job_description is required")
	}

	analysis, err := h.aiService.AnalyzeJob(c.Request().Context(), userID, req.JobDescription)
	if err != nil {
		if errors.Is(err, ai.ErrProfileNotFound) {
			return echo.NewHTTPError(http.StatusBadRequest, "please complete your profile before analyzing jobs")
		}
		if errors.Is(err, ai.ErrEmptyJobDescription) {
			return echo.NewHTTPError(http.StatusBadRequest, "job description cannot be empty")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to analyze job: "+err.Error())
	}

	return c.JSON(http.StatusOK, ai.AnalyzeJobResponse{
		Analysis: analysis,
	})
}

// GenerateCV handles POST /api/ai/generate-cv
func (h *AIHandler) GenerateCV(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.aiService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "AI service not available")
	}

	var req ai.GenerateCVRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid request body")
	}

	if req.JobDescription == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "job_description is required")
	}

	response, err := h.aiService.GenerateCV(c.Request().Context(), userID, &req)
	if err != nil {
		if errors.Is(err, ai.ErrOutOfCredits) {
			return echo.NewHTTPError(http.StatusPaymentRequired, "you have used all your free generation credits")
		}
		if errors.Is(err, ai.ErrProfileNotFound) {
			return echo.NewHTTPError(http.StatusBadRequest, "please complete your profile before generating CVs")
		}
		if errors.Is(err, ai.ErrEmptyJobDescription) {
			return echo.NewHTTPError(http.StatusBadRequest, "job description cannot be empty")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to generate CV: "+err.Error())
	}

	return c.JSON(http.StatusOK, response)
}

// GetCredits handles GET /api/ai/credits (alternative endpoint)
func (h *AIHandler) GetCredits(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.aiService == nil {
		return echo.NewHTTPError(http.StatusServiceUnavailable, "AI service not available")
	}

	credits, err := h.aiService.GetCredits(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get credits")
	}

	return c.JSON(http.StatusOK, credits)
}
