'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useModels(brandId: string) {
    const { data } = useQuery({
        queryKey: queryKeys.models(brandId),
        queryFn: async () => {
            const res = await fetch(`/api/filters/models?brandId=${brandId}`)
            return res.json()
        },
        enabled: !!brandId, // Only run the query if conversationId is not null
    })
    return { data }
}