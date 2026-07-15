import { queryKeys } from "@/lib/react-query/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useWishlist() {
    const { user } = useAuth()
    const toWishlistSet = (ids: string[]) => new Set(ids)

    const { data: wishlist } = useQuery({
        queryKey: queryKeys.wishlist(user?.id),
        queryFn: () => fetch('/api/wishlist').then(r => r.json()),
        select: toWishlistSet,
        enabled: !!user?.id,
        staleTime: 60_000,
        gcTime: 30 * 60_000
    })

    return { wishlist }
}