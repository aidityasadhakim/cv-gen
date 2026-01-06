import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

/**
 * Hook that returns an API client with automatic auth token handling
 */
export function useApiClient() {
  const { getToken, isSignedIn } = useAuth()

  const request = useCallback(
    async <T>(
      endpoint: string,
      options?: RequestOptions
    ): Promise<ApiResponse<T>> => {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...options?.headers,
        }

        // Add auth token if signed in
        if (isSignedIn) {
          const token = await getToken()
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        })

        // Handle 401 - could trigger re-auth flow
        if (response.status === 401) {
          return {
            data: null,
            error: 'Unauthorized - please sign in again',
            status: 401,
          }
        }

        // Parse JSON response
        const data = await response.json()

        if (!response.ok) {
          return {
            data: null,
            error: data.message || data.error || 'Request failed',
            status: response.status,
          }
        }

        return {
          data,
          error: null,
          status: response.status,
        }
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : 'Network error',
          status: 0,
        }
      }
    },
    [getToken, isSignedIn]
  )

  const get = useCallback(
    <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'GET' }),
    [request]
  )

  const post = useCallback(
    <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request]
  )

  const put = useCallback(
    <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
      request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),
    [request]
  )

  const del = useCallback(
    <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { ...options, method: 'DELETE' }),
    [request]
  )

  return { request, get, post, put, delete: del }
}

/**
 * Create query key factory for React Query
 */
export const apiKeys = {
  all: ['api'] as const,
  health: () => [...apiKeys.all, 'health'] as const,
  profile: () => [...apiKeys.all, 'profile'] as const,
  credits: () => [...apiKeys.all, 'credits'] as const,
  cvs: () => [...apiKeys.all, 'cvs'] as const,
  cv: (id: string) => [...apiKeys.cvs(), id] as const,
  coverLetters: () => [...apiKeys.all, 'coverLetters'] as const,
  coverLetter: (id: string) => [...apiKeys.coverLetters(), id] as const,
}

// Type definitions for API responses
export interface HealthResponse {
  status: string
  time: string
}

export interface ProfileResponse {
  user_id: string
  has_profile: boolean
  profile?: {
    id: string
    user_id: string
    resume_data: Record<string, unknown>
    created_at: string
    updated_at: string
  }
}

export interface CreditsResponse {
  user_id: string
  free_generations_used: number
  free_generations_limit: number
  free_generations_remaining: number
}
