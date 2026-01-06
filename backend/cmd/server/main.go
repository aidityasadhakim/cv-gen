package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"cv-gen/backend/internal/config"
	"cv-gen/backend/internal/db"
	appMiddleware "cv-gen/backend/internal/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize Clerk SDK
	if cfg.ClerkSecretKey != "" {
		appMiddleware.InitClerk(cfg.ClerkSecretKey)
	} else {
		log.Println("WARNING: CLERK_SECRET_KEY not set, authentication will not work")
	}

	// Initialize database connection
	ctx := context.Background()
	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Printf("WARNING: Failed to connect to database: %v", err)
		// Continue without database for now
	} else {
		defer pool.Close()
		log.Println("Connected to database successfully")
	}

	// Create SQLC queries instance
	var queries *db.Queries
	if pool != nil {
		queries = db.New(pool.Pool)
	}

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Public routes (no auth required)
	e.GET("/api/health", healthHandler)

	// Protected routes (auth required)
	protected := e.Group("/api")
	protected.Use(appMiddleware.ClerkAuth())

	// Protected endpoints - pass queries to handlers
	protected.GET("/profile", func(c echo.Context) error {
		return profileHandler(c, queries)
	})
	protected.GET("/credits", func(c echo.Context) error {
		return creditsHandler(c, queries)
	})

	// Get port from configuration
	port := cfg.BackendPort

	// Start server with graceful shutdown
	go func() {
		if err := e.Start(":" + port); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	// Graceful shutdown with 10 second timeout
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(shutdownCtx); err != nil {
		e.Logger.Fatal(err)
	}
}

// healthHandler returns the health status of the API
func healthHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status": "healthy",
		"time":   time.Now().Format(time.RFC3339),
	})
}

// profileHandler returns the authenticated user's profile
func profileHandler(c echo.Context, queries *db.Queries) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if queries == nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"user_id": userID,
			"message": "Database not connected",
		})
	}

	// Try to get the user's profile
	profile, err := queries.GetMasterProfile(c.Request().Context(), userID)
	if err != nil {
		// Profile doesn't exist yet, return empty profile
		return c.JSON(http.StatusOK, map[string]interface{}{
			"user_id":     userID,
			"has_profile": false,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user_id":     userID,
		"has_profile": true,
		"profile":     profile,
	})
}

// creditsHandler returns the authenticated user's credits
func creditsHandler(c echo.Context, queries *db.Queries) error {
	userID, err := appMiddleware.RequireUserID(c)
	if err != nil {
		return err
	}

	if queries == nil {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"user_id": userID,
			"message": "Database not connected",
		})
	}

	// Get or create user credits
	credits, err := queries.GetOrCreateUserCredits(c.Request().Context(), userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "failed to get credits")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user_id":                    userID,
		"free_generations_used":      credits.FreeGenerationsUsed,
		"free_generations_limit":     credits.FreeGenerationsLimit,
		"free_generations_remaining": credits.FreeGenerationsLimit - credits.FreeGenerationsUsed,
	})
}
