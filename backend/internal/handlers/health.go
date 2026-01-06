package handlers

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// Health returns the health status of the API
func (h *Handler) Health(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}
