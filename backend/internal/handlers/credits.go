package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"

	appMiddleware "cv-gen/backend/internal/middleware"
)

// Credits returns the authenticated user's credits
func (h *Handler) Credits(c echo.Context) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if h.Queries == nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"user_id": userID,
			"message": "Database not connected",
		})
	}

	// Get or create user credits
	credits, err := h.Queries.GetOrCreateUserCredits(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get credits")
	}

	// Calculate remaining credits (free + paid)
	freeRemaining := credits.FreeGenerationsLimit - credits.FreeGenerationsUsed
	if freeRemaining < 0 {
		freeRemaining = 0
	}
	totalRemaining := freeRemaining + credits.PaidCredits

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user_id":                    userID,
		"free_generations_used":      credits.FreeGenerationsUsed,
		"free_generations_limit":     credits.FreeGenerationsLimit,
		"free_generations_remaining": freeRemaining,
		"paid_credits":               credits.PaidCredits,
		"total_generations":          credits.TotalGenerations,
		"remaining":                  totalRemaining,
	})
}
