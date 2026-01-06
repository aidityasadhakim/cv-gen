import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiKeys, useApiClient } from '../lib/api'

import type { JSONResume } from '../types/json-resume'
import type { JobAnalysis } from '../types/ai'

/**
 * CV response from API
 */
export interface CVResponse {
  id: string
  user_id: string
  name: string
  cv_data: JSONResume
  template_id: string
  job_url?: string
  job_title?: string
  job_description?: string
  company_name?: string
  match_score?: number
  ai_suggestions?: JobAnalysis
  created_at: string
  updated_at: string
}

/**
 * CV list item (without full cv_data)
 */
export interface CVListItem {
  id: string
  user_id: string
  name: string
  template_id: string
  job_title?: string
  company_name?: string
  match_score?: number
  created_at: string
  updated_at: string
}

/**
 * Paginated list response
 */
export interface CVListResponse {
  cvs: Array<CVListItem>
  total: number
  page: number
  page_size: number
  total_pages: number
}

/**
 * Input for creating a CV
 */
export interface CreateCVInput {
  name?: string
  template_id?: string
}

/**
 * Input for updating a CV
 */
export interface UpdateCVInput {
  name?: string
  cv_data?: JSONResume
  template_id?: string
}

/**
 * Hook to fetch all CVs for the current user
 */
export function useCVs(page = 1, pageSize = 10) {
  const api = useApiClient()

  return useQuery({
    queryKey: [...apiKeys.cvs(), { page, pageSize }],
    queryFn: async () => {
      const response = await api.get<CVListResponse>(
        `/api/cvs?page=${page}&page_size=${pageSize}`
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

/**
 * Hook to fetch a single CV by ID
 */
export function useCV(cvId: string | undefined) {
  const api = useApiClient()

  return useQuery({
    queryKey: apiKeys.cv(cvId ?? ''),
    queryFn: async () => {
      if (!cvId) throw new Error('CV ID is required')
      const response = await api.get<CVResponse>(`/api/cvs/${cvId}`)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!cvId,
  })
}

/**
 * Hook to create a new CV
 */
export function useCreateCV() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCVInput) => {
      const response = await api.post<CVResponse>('/api/cvs', input)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.cvs() })
    },
  })
}

/**
 * Hook to update a CV
 */
export function useUpdateCV() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ cvId, input }: { cvId: string; input: UpdateCVInput }) => {
      const response = await api.put<CVResponse>(`/api/cvs/${cvId}`, input)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(apiKeys.cv(data.id), data)
        queryClient.invalidateQueries({ queryKey: apiKeys.cvs() })
      }
    },
  })
}

/**
 * Hook to delete a CV
 */
export function useDeleteCV() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cvId: string) => {
      const response = await api.delete<{ message: string }>(`/api/cvs/${cvId}`)
      if (response.error) {
        throw new Error(response.error)
      }
      return cvId
    },
    onSuccess: (cvId) => {
      queryClient.removeQueries({ queryKey: apiKeys.cv(cvId) })
      queryClient.invalidateQueries({ queryKey: apiKeys.cvs() })
    },
  })
}

/**
 * Hook to duplicate a CV
 */
export function useDuplicateCV() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cvId: string) => {
      const response = await api.post<CVResponse>(`/api/cvs/${cvId}/duplicate`)
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.cvs() })
    },
  })
}
