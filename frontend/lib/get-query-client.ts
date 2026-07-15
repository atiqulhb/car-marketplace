import { QueryClient, defaultShouldDehydrateQuery, environmentManager } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // CRITICAL: Prevents immediate refetch on client mount
        staleTime: 60 * 1000, 
      },
      dehydrate: {
        // Include pending queries for streaming support
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  }
  
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}   