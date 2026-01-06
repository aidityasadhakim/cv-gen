/**
 * AI-related TypeScript Types
 */

import type { JSONResume } from './json-resume'

// Job Analysis Types
export interface JobAnalysis {
  match_score: number
  matching_skills: string[]
  missing_skills: string[]
  relevant_experiences: string[]
  suggestions: string[]
  keywords_to_include: string[]
}

export interface AnalyzeJobRequest {
  job_description: string
}

export interface AnalyzeJobResponse {
  analysis: JobAnalysis
}

// CV Generation Types
export interface GenerateCVRequest {
  job_description: string
  cv_name?: string
  job_title?: string
  company_name?: string
  job_url?: string
}

export interface CVData {
  id: string
  name: string
  resume_data: JSONResume
  match_score: number
  job_title?: string
  company?: string
  created_at: string
}

export interface GenerateCVResponse {
  cv: CVData
  analysis: JobAnalysis
  credits_remaining: number
}

// Credits Types
export interface CreditsResponse {
  free_generations_used: number
  free_generations_limit: number
  free_generations_remaining: number
  paid_credits: number
  total_generations: number
  remaining: number
}
