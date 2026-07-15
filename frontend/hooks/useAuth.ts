import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/react-query/query-keys"

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.authedUser,
    queryFn: async () => {
      const res = await fetch("/api/authUser")

      const data = await res.json()
      if (!res.ok) {
        throw new Error("Failed to fetch authenticated user")
      }
      return data
    },
  })

  return { user, isLoading }
} 