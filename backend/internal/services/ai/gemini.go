package ai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"google.golang.org/genai"
)

var (
	// ErrAPIKeyNotSet is returned when the Gemini API key is not configured
	ErrAPIKeyNotSet = errors.New("gemini API key not set")
	// ErrGenerationFailed is returned when content generation fails
	ErrGenerationFailed = errors.New("failed to generate content")
	// ErrInvalidResponse is returned when the AI response cannot be parsed
	ErrInvalidResponse = errors.New("invalid AI response")
)

// GeminiClient wraps the Google Gemini API client
type GeminiClient struct {
	client *genai.Client
	model  string
}

// NewGeminiClient creates a new Gemini client
func NewGeminiClient(apiKey string) (*GeminiClient, error) {
	if apiKey == "" {
		return nil, ErrAPIKeyNotSet
	}

	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create gemini client: %w", err)
	}

	return &GeminiClient{
		client: client,
		model:  "gemini-2.5-flash",
	}, nil
}

// GenerateJSON generates content with a JSON schema constraint
func (g *GeminiClient) GenerateJSON(ctx context.Context, prompt string, schema map[string]interface{}) (string, error) {
	response, err := g.client.Models.GenerateContent(ctx,
		g.model,
		genai.Text(prompt),
		&genai.GenerateContentConfig{
			ResponseMIMEType:   "application/json",
			ResponseJsonSchema: schema,
		},
	)
	if err != nil {
		return "", fmt.Errorf("%w: %v", ErrGenerationFailed, err)
	}

	return response.Text(), nil
}

// GenerateText generates plain text content
func (g *GeminiClient) GenerateText(ctx context.Context, prompt string) (string, error) {
	response, err := g.client.Models.GenerateContent(ctx,
		g.model,
		genai.Text(prompt),
		nil,
	)
	if err != nil {
		return "", fmt.Errorf("%w: %v", ErrGenerationFailed, err)
	}

	return response.Text(), nil
}

// AnalyzeJob analyzes a job description against a candidate profile
func (g *GeminiClient) AnalyzeJob(ctx context.Context, profileJSON string, jobDescription string) (*JobAnalysis, error) {
	prompt := buildJobAnalysisPrompt(profileJSON, jobDescription)

	responseText, err := g.GenerateJSON(ctx, prompt, jobAnalysisSchema)
	if err != nil {
		return nil, err
	}

	var analysis JobAnalysis
	if err := json.Unmarshal([]byte(responseText), &analysis); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidResponse, err)
	}

	return &analysis, nil
}

// TailorCV generates a tailored CV based on the profile and job description
func (g *GeminiClient) TailorCV(ctx context.Context, profileJSON string, jobDescription string, analysis *JobAnalysis) (string, error) {
	analysisJSON, err := json.Marshal(analysis)
	if err != nil {
		return "", fmt.Errorf("failed to marshal analysis: %w", err)
	}

	prompt := buildCVTailoringPrompt(profileJSON, jobDescription, string(analysisJSON))

	responseText, err := g.GenerateJSON(ctx, prompt, jsonResumeSchema)
	if err != nil {
		return "", err
	}

	return responseText, nil
}

// GenerateCoverLetter generates a cover letter based on the profile and job details
func (g *GeminiClient) GenerateCoverLetter(ctx context.Context, profileJSON string, jobTitle string, companyName string, jobDescription string, cvSummary string) (string, error) {
	prompt := buildCoverLetterPrompt(profileJSON, jobTitle, companyName, jobDescription, cvSummary)

	responseText, err := g.GenerateText(ctx, prompt)
	if err != nil {
		return "", err
	}

	return responseText, nil
}

// Close closes the Gemini client (no-op for this client)
func (g *GeminiClient) Close() error {
	// The google.golang.org/genai client doesn't require explicit closing
	return nil
}
