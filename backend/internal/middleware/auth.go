// Package middleware provides HTTP middleware functions
package middleware

import (
	"net/http"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/labstack/echo/v4"
)

const (
	// UserIDKey is the key used to store the user ID in the Echo context
	UserIDKey = "user_id"
)

// ClerkAuth returns an Echo middleware that validates Clerk JWT tokens
func ClerkAuth() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Extract the token from the Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(http.StatusUnauthorized, "missing authorization header")
			}

			// Remove "Bearer " prefix
			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token == authHeader {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid authorization header format")
			}

			// Verify the JWT token
			claims, err := jwt.Verify(c.Request().Context(), &jwt.VerifyParams{
				Token: token,
			})
			if err != nil {
				return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
			}

			// Store the user ID in the context
			c.Set(UserIDKey, claims.Subject)

			return next(c)
		}
	}
}

// GetUserID extracts the user ID from the Echo context
// Returns empty string if not found
func GetUserID(c echo.Context) string {
	userID, ok := c.Get(UserIDKey).(string)
	if !ok {
		return ""
	}
	return userID
}

// RequireUserID extracts the user ID from the Echo context
// Returns an error if not found
func RequireUserID(c echo.Context) (string, error) {
	userID := GetUserID(c)
	if userID == "" {
		return "", echo.NewHTTPError(http.StatusUnauthorized, "user not authenticated")
	}
	return userID, nil
}

// InitClerk initializes the Clerk SDK with the secret key
func InitClerk(secretKey string) {
	clerk.SetKey(secretKey)
}
