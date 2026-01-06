// Package routes provides route registration for the HTTP server
package routes

import (
	"github.com/labstack/echo/v4"

	"cv-gen/backend/internal/handlers"
	appMiddleware "cv-gen/backend/internal/middleware"
)

// Register registers all routes with the Echo instance
func Register(e *echo.Echo, h *handlers.Handler, aiHandler *handlers.AIHandler) {
	// Public routes (no auth required)
	e.GET("/api/health", h.Health)

	// Protected routes (auth required)
	protected := e.Group("/api")
	protected.Use(appMiddleware.ClerkAuth())

	// Profile endpoints - users can only access their own profile
	// Authorization is enforced via the authenticated user ID
	protected.GET("/profile", h.GetProfile)
	protected.PUT("/profile", h.UpdateProfile)
	protected.PATCH("/profile/:section", h.UpdateProfileSection)
	protected.DELETE("/profile", h.DeleteProfile)

	// Credits endpoints
	protected.GET("/credits", h.Credits)

	// CV endpoints
	protected.GET("/cvs", h.ListCVs)
	protected.POST("/cvs", h.CreateCV)
	protected.GET("/cvs/:id", h.GetCV)
	protected.PUT("/cvs/:id", h.UpdateCV)
	protected.DELETE("/cvs/:id", h.DeleteCV)
	protected.POST("/cvs/:id/duplicate", h.DuplicateCV)

	// AI endpoints
	if aiHandler != nil {
		protected.POST("/ai/analyze-job", aiHandler.AnalyzeJob)
		protected.POST("/ai/generate-cv", aiHandler.GenerateCV)
	}
}
