import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/react-query/query-keys"

export function useBrands() {
        const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: queryKeys.brands,
        initialPageParam: null,
        queryFn: async ({ pageParam }) =>  {
            console.log('page param', pageParam)
            // if (cursor) {
            //     searchParams.set('cursor', cursor)
            // }
            
           const res = await fetch('/api/filters/brands?cursor=' + pageParam)
            if (!res.ok) {
                throw new Error(`Failed to fetch cars: ${res.statusText}`)
            }
            
            return await res.json()
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    

    const brands = data?.pages.flatMap(page => page.items) ?? []

    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!hasNextPage) return

        const el = sentinelRef.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isFetchingNextPage) {
                fetchNextPage()
            }
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    return { brands, sentinelRef }
}