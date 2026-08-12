'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useModels(brand: string[]) {
    console.log("brand array from useModels hook", brand)
    const { data: models } = useQuery({
        queryKey: queryKeys.models([...brand].sort()),
        queryFn: async () => {
            const res = await fetch(`/api/filters/models?brand=${brand.toString()}`)
            return res.json()
        }
    })
    return { models }
}