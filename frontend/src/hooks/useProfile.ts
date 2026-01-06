import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiKeys, useApiClient } from '../lib/api'

import type {
  JSONResume,
  ProfileResponse,
  ResumeSectionId,
} from '../types/json-resume'

/**
 * Hook to fetch the user's profile
 */
export function useProfile() {
  const api = useApiClient()

  return useQuery({
    queryKey: apiKeys.profile(),
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/api/profile')
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
  })
}

/**
 * Hook to update the entire profile
 */
export function useUpdateProfile() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: JSONResume) => {
      const response = await api.put<ProfileResponse>('/api/profile', {
        resume_data: data,
      })
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(apiKeys.profile(), data)
    },
  })
}

/**
 * Hook to update a specific section of the profile
 */
export function useUpdateProfileSection() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      section,
      data,
    }: {
      section: ResumeSectionId
      data: unknown
    }) => {
      const response = await api.patch<ProfileResponse>(
        `/api/profile/${section}`,
        data
      )
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(apiKeys.profile(), data)
    },
  })
}

/**
 * Hook to delete the user's profile
 */
export function useDeleteProfile() {
  const api = useApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>('/api/profile')
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.profile() })
    },
  })
}
