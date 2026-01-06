package main

import (
	"context"
	"cv-gen/backend/internal/config"
	"cv-gen/backend/internal/db"
	"cv-gen/backend/internal/handlers"
	"cv-gen/backend/internal/routes"
	"cv-gen/backend/internal/services/ai"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

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

	// Create handler with dependencies
	h := handlers.New(queries)

	// Initialize AI service
	var aiHandler *handlers.AIHandler
	if cfg.GeminiAPIKey != "" && queries != nil {
		aiService, err := ai.New(cfg.GeminiAPIKey, queries)
		if err != nil {
			log.Printf("WARNING: Failed to initialize AI service: %v", err)
		} else {
			aiHandler = handlers.NewAIHandler(aiService)
			log.Println("AI service initialized successfully")
			defer aiService.Close()
		}
	} else {
		if cfg.GeminiAPIKey == "" {
			log.Println("WARNING: GEMINI_API_KEY not set, AI features will be disabled")
		}
		if queries == nil {
			log.Println("WARNING: Database not connected, AI features will be disabled")
		}
	}

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Register routes
	routes.Register(e, h, aiHandler)

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
