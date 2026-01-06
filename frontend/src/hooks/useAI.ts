import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiKeys, useApiClient } from '../lib/api'

import type {
  AnalyzeJobRequest,
  AnalyzeJobResponse,
  GenerateCVRequest,
  GenerateCVResponse,
  CreditsResponse,
} from '../types/ai'

/**
 * Hook to fetch the user's credits
 */
export function useCredits() {
  const api = useApiClient()

  return useQuery({
    queryKey: apiKeys.credits(),
    queryFn: async () => {
      const response = await api.get<CreditsResponse>('/api/credits')
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

/**
 * Hook to analyze a job description against the user's profile
 */
export function useAnalyzeJob() {
  const api = useApiClient()

  return useMutation({
    mutationFn: async (request: AnalyzeJobRequest) => {
      const response = await api.post<AnalyzeJobResponse>(
        '/api/ai/analyze-job',
        request
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

/**
 * Hook to generate a tailored CV based on a job description
 */
export function useGenerateCV() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: GenerateCVRequest) => {
      const response = await api.post<GenerateCVResponse>(
        '/api/ai/generate-cv',
        request
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate CVs list to show new CV
      queryClient.invalidateQueries({ queryKey: apiKeys.cvs() })
      // Update credits cache
      if (data) {
        queryClient.setQueryData(apiKeys.credits(), {
          free_generations_used:
            data.credits_remaining !== undefined
              ? 10 - data.credits_remaining
              : undefined,
          free_generations_limit: 10,
          remaining: data.credits_remaining,
        })
      }
    },
  })
}
