import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiKeys, useApiClient } from '../lib/api'

/**
 * Cover letter response from API
 */
export interface CoverLetterResponse {
  id: string
  user_id: string
  cv_id?: string
  content: string
  job_title?: string
  company_name?: string
  created_at: string
  updated_at: string
}

/**
 * Cover letter list item
 */
export interface CoverLetterListItem {
  id: string
  user_id: string
  cv_id?: string
  job_title?: string
  company_name?: string
  created_at: string
  updated_at: string
}

/**
 * List response
 */
export interface CoverLetterListResponse {
  cover_letters: CoverLetterListItem[]
}

/**
 * Input for creating a cover letter
 */
export interface CreateCoverLetterInput {
  cv_id?: string
  content: string
  job_title?: string
  company_name?: string
}

/**
 * Input for updating a cover letter
 */
export interface UpdateCoverLetterInput {
  content: string
}

/**
 * Input for generating a cover letter via AI
 */
export interface GenerateCoverLetterInput {
  cv_id?: string
  job_title: string
  company_name: string
  job_description?: string
}

/**
 * Response from AI cover letter generation
 */
export interface GenerateCoverLetterResponse {
  cover_letter: {
    id: string
    content: string
    job_title: string
    company_name: string
    cv_id?: string
    created_at: string
  }
  credits_remaining: number
}

/**
 * Hook to fetch all cover letters for the current user
 */
export function useCoverLetters() {
  const api = useApiClient()

  return useQuery({
    queryKey: apiKeys.coverLetters(),
    queryFn: async () => {
      const response = await api.get<CoverLetterListResponse>('/api/cover-letters')
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

/**
 * Hook to fetch a single cover letter by ID
 */
export function useCoverLetter(coverLetterId: string | undefined) {
  const api = useApiClient()

  return useQuery({
    queryKey: apiKeys.coverLetter(coverLetterId ?? ''),
    queryFn: async () => {
      if (!coverLetterId) throw new Error('Cover letter ID is required')
      const response = await api.get<CoverLetterResponse>(
        `/api/cover-letters/${coverLetterId}`
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    enabled: !!coverLetterId,
  })
}

/**
 * Hook to create a new cover letter
 */
export function useCreateCoverLetter() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCoverLetterInput) => {
      const response = await api.post<CoverLetterResponse>(
        '/api/cover-letters',
        input
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.coverLetters() })
    },
  })
}

/**
 * Hook to update a cover letter
 */
export function useUpdateCoverLetter() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      coverLetterId,
      input,
    }: {
      coverLetterId: string
      input: UpdateCoverLetterInput
    }) => {
      const response = await api.put<CoverLetterResponse>(
        `/api/cover-letters/${coverLetterId}`,
        input
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(apiKeys.coverLetter(data.id), data)
        queryClient.invalidateQueries({ queryKey: apiKeys.coverLetters() })
      }
    },
  })
}

/**
 * Hook to delete a cover letter
 */
export function useDeleteCoverLetter() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (coverLetterId: string) => {
      const response = await api.delete<{ message: string }>(
        `/api/cover-letters/${coverLetterId}`
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return coverLetterId
    },
    onSuccess: (coverLetterId) => {
      queryClient.removeQueries({ queryKey: apiKeys.coverLetter(coverLetterId) })
      queryClient.invalidateQueries({ queryKey: apiKeys.coverLetters() })
    },
  })
}

/**
 * Hook to generate a cover letter using AI
 */
export function useGenerateCoverLetter() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: GenerateCoverLetterInput) => {
      const response = await api.post<GenerateCoverLetterResponse>(
        '/api/ai/generate-cover-letter',
        input
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.coverLetters() })
      queryClient.invalidateQueries({ queryKey: apiKeys.credits() })
    },
  })
}
