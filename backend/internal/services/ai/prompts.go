package ai

import "fmt"

// jobAnalysisSchema defines the JSON schema for job analysis responses
var jobAnalysisSchema = map[string]interface{}{
	"type": "object",
	"properties": map[string]interface{}{
		"match_score": map[string]interface{}{
			"type":        "integer",
			"minimum":     0,
			"maximum":     100,
			"description": "How well the candidate matches the job requirements (0-100)",
		},
		"matching_skills": map[string]interface{}{
			"type":        "array",
			"items":       map[string]interface{}{"type": "string"},
			"description": "Skills the candidate has that match the job requirements",
		},
		"missing_skills": map[string]interface{}{
			"type":        "array",
			"items":       map[string]interface{}{"type": "string"},
			"description": "Skills the job requires that the candidate may be lacking",
		},
		"relevant_experiences": map[string]interface{}{
			"type":        "array",
			"items":       map[string]interface{}{"type": "string"},
			"description": "Candidate's experiences that are relevant to this job",
		},
		"suggestions": map[string]interface{}{
			"type":        "array",
			"items":       map[string]interface{}{"type": "string"},
			"description": "Actionable suggestions for tailoring the CV",
		},
		"keywords_to_include": map[string]interface{}{
			"type":        "array",
			"items":       map[string]interface{}{"type": "string"},
			"description": "Important keywords from the job description to include in the CV",
		},
	},
	"required": []string{"match_score", "matching_skills", "missing_skills", "relevant_experiences", "suggestions", "keywords_to_include"},
}

// jsonResumeSchema defines the JSON schema for tailored CV responses (JSON Resume format)
var jsonResumeSchema = map[string]interface{}{
	"type": "object",
	"properties": map[string]interface{}{
		"basics": map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"name":    map[string]interface{}{"type": "string"},
				"label":   map[string]interface{}{"type": "string"},
				"email":   map[string]interface{}{"type": "string"},
				"phone":   map[string]interface{}{"type": "string"},
				"url":     map[string]interface{}{"type": "string"},
				"summary": map[string]interface{}{"type": "string"},
				"location": map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"address":     map[string]interface{}{"type": "string"},
						"postalCode":  map[string]interface{}{"type": "string"},
						"city":        map[string]interface{}{"type": "string"},
						"countryCode": map[string]interface{}{"type": "string"},
						"region":      map[string]interface{}{"type": "string"},
					},
				},
				"profiles": map[string]interface{}{
					"type": "array",
					"items": map[string]interface{}{
						"type": "object",
						"properties": map[string]interface{}{
							"network":  map[string]interface{}{"type": "string"},
							"username": map[string]interface{}{"type": "string"},
							"url":      map[string]interface{}{"type": "string"},
						},
					},
				},
			},
		},
		"work": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":       map[string]interface{}{"type": "string"},
					"position":   map[string]interface{}{"type": "string"},
					"url":        map[string]interface{}{"type": "string"},
					"startDate":  map[string]interface{}{"type": "string"},
					"endDate":    map[string]interface{}{"type": "string"},
					"summary":    map[string]interface{}{"type": "string"},
					"highlights": map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
					"location":   map[string]interface{}{"type": "string"},
				},
			},
		},
		"education": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"institution": map[string]interface{}{"type": "string"},
					"url":         map[string]interface{}{"type": "string"},
					"area":        map[string]interface{}{"type": "string"},
					"studyType":   map[string]interface{}{"type": "string"},
					"startDate":   map[string]interface{}{"type": "string"},
					"endDate":     map[string]interface{}{"type": "string"},
					"score":       map[string]interface{}{"type": "string"},
					"courses":     map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
				},
			},
		},
		"skills": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":     map[string]interface{}{"type": "string"},
					"level":    map[string]interface{}{"type": "string"},
					"keywords": map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
				},
			},
		},
		"projects": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":        map[string]interface{}{"type": "string"},
					"description": map[string]interface{}{"type": "string"},
					"highlights":  map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
					"keywords":    map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
					"startDate":   map[string]interface{}{"type": "string"},
					"endDate":     map[string]interface{}{"type": "string"},
					"url":         map[string]interface{}{"type": "string"},
					"roles":       map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
					"entity":      map[string]interface{}{"type": "string"},
					"type":        map[string]interface{}{"type": "string"},
				},
			},
		},
		"certificates": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":   map[string]interface{}{"type": "string"},
					"date":   map[string]interface{}{"type": "string"},
					"issuer": map[string]interface{}{"type": "string"},
					"url":    map[string]interface{}{"type": "string"},
				},
			},
		},
		"awards": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"title":   map[string]interface{}{"type": "string"},
					"date":    map[string]interface{}{"type": "string"},
					"awarder": map[string]interface{}{"type": "string"},
					"summary": map[string]interface{}{"type": "string"},
				},
			},
		},
		"publications": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":        map[string]interface{}{"type": "string"},
					"publisher":   map[string]interface{}{"type": "string"},
					"releaseDate": map[string]interface{}{"type": "string"},
					"url":         map[string]interface{}{"type": "string"},
					"summary":     map[string]interface{}{"type": "string"},
				},
			},
		},
		"languages": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"language": map[string]interface{}{"type": "string"},
					"fluency":  map[string]interface{}{"type": "string"},
				},
			},
		},
		"volunteer": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"organization": map[string]interface{}{"type": "string"},
					"position":     map[string]interface{}{"type": "string"},
					"url":          map[string]interface{}{"type": "string"},
					"startDate":    map[string]interface{}{"type": "string"},
					"endDate":      map[string]interface{}{"type": "string"},
					"summary":      map[string]interface{}{"type": "string"},
					"highlights":   map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
				},
			},
		},
		"interests": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":     map[string]interface{}{"type": "string"},
					"keywords": map[string]interface{}{"type": "array", "items": map[string]interface{}{"type": "string"}},
				},
			},
		},
		"references": map[string]interface{}{
			"type": "array",
			"items": map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"name":      map[string]interface{}{"type": "string"},
					"reference": map[string]interface{}{"type": "string"},
				},
			},
		},
	},
}

// buildJobAnalysisPrompt creates the prompt for job analysis
func buildJobAnalysisPrompt(profileJSON string, jobDescription string) string {
	return fmt.Sprintf(`You are a career advisor analyzing job fit. Compare the candidate's profile with the job requirements.

Candidate Profile (JSON Resume format):
%s

Job Description:
%s

Analyze the candidate's fit for this role. Consider:
1. Technical skills and their proficiency levels
2. Work experience relevance and seniority
3. Education background
4. Projects that demonstrate relevant abilities
5. Certifications that add value

Provide:
- A match score from 0-100 (be realistic, not overly generous)
- Skills the candidate has that match the job
- Skills the job requires that the candidate may lack or need to highlight better
- Relevant experiences from their background
- Actionable suggestions for tailoring their CV
- Important keywords from the job description they should include

Focus on being helpful and constructive. If the match isn't perfect, suggest how to best present their existing experience.`, profileJSON, jobDescription)
}

// buildCVTailoringPrompt creates the prompt for CV tailoring
func buildCVTailoringPrompt(profileJSON string, jobDescription string, analysisJSON string) string {
	return fmt.Sprintf(`You are an expert resume writer. Create a tailored resume based on the candidate's master profile and the target job.

Master Profile (JSON Resume format):
%s

Target Job Description:
%s

Job Analysis:
%s

Create a tailored JSON Resume that:
1. Rewrites the summary to directly address the job requirements and highlight the most relevant qualifications
2. Reorders work experience to put the most relevant positions first
3. Adjusts work experience highlights/bullet points to emphasize accomplishments relevant to this job
4. Prioritizes and reorders skills to put the most relevant ones first
5. Includes relevant projects that demonstrate required abilities
6. Incorporates keywords from the job description naturally

CRITICAL RULES:
- Do NOT invent or fabricate any experience, education, skills, or achievements
- Only use information that exists in the original profile
- You may rephrase and emphasize existing content, but never add fictional content
- Quantify achievements where data exists in the original profile
- Keep all dates, company names, and factual information accurate

Return a valid JSON Resume. Do not include any markdown formatting or code blocks.`, profileJSON, jobDescription, analysisJSON)
}
