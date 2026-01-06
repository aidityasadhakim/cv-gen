// Package config provides environment configuration for the application
package config

import (
	"os"
)

// Config holds all configuration for the application
type Config struct {
	DatabaseURL    string
	BackendPort    string
	BackendHost    string
	ClerkSecretKey string
	GeminiAPIKey   string
}

// Load returns a new Config with values from environment variables
func Load() *Config {
	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://cvgen:cvgen_secret@localhost:5432/cvgen_db?sslmode=disable"),
		BackendPort:    getEnv("BACKEND_PORT", "8080"),
		BackendHost:    getEnv("BACKEND_HOST", "0.0.0.0"),
		ClerkSecretKey: getEnv("CLERK_SECRET_KEY", ""),
		GeminiAPIKey:   getEnv("GEMINI_API_KEY", ""),
	}
}

// getEnv returns the value of an environment variable or a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
