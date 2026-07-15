'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useMessages(conversationId: string) {
    const { data } = useQuery({
        queryKey: queryKeys.messages(conversationId),
        queryFn: async () => {
            const res = await fetch(`/api/messages?conversationId=${conversationId}`)
            return res.json()
        },
        enabled: !!conversationId, // Only run the query if conversationId is not null
    })
    return { data }
}