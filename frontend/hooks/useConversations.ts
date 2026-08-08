'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"

export default function useConversations() {
    const { user } = useAuth()
    
    const { data } = useQuery({
        queryKey: queryKeys.conversations(user?.id),
        queryFn: async () => {
            const res = await fetch('/api/conversations')
            const data = await res.json()
            return data
        },
        enabled: !!user
    })

    return data
}