import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: how long data is considered fresh (5 minutes)
        staleTime: 1000 * 60 * 5,
        // GC time: how long inactive data stays in cache (30 minutes)
        gcTime: 1000 * 60 * 30,
        // Retry failed requests 1 time
        retry: 1,
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: 'always',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
