// Package handlers provides HTTP request handlers
package handlers

import (
	"cv-gen/backend/internal/db"
	cvSvc "cv-gen/backend/internal/services/cv"
	profileSvc "cv-gen/backend/internal/services/profile"
)

// Handler holds all dependencies for HTTP handlers
type Handler struct {
	Queries        *db.Queries
	ProfileService *profileSvc.Service
	CVService      *cvSvc.Service
}

// New creates a new Handler with the given dependencies
func New(queries *db.Queries) *Handler {
	var profileService *profileSvc.Service
	var cvService *cvSvc.Service
	if queries != nil {
		profileService = profileSvc.New(queries)
		cvService = cvSvc.New(queries)
	}

	return &Handler{
		Queries:        queries,
		ProfileService: profileService,
		CVService:      cvService,
	}
}
