import { QueryClient } from '@tanstack/react-query'

const THREE_MINUTES = 3 * 60 * 1000
const FIVE_MINUTES = 5 * 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THREE_MINUTES,
      gcTime: FIVE_MINUTES,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
