import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWishListing } from '@/actions/toggleWishListing'
import { queryKeys } from "@/lib/react-query/query-keys";
import { useAuth } from "./useAuth";

export function useToggleWishListing() {
    const qc = useQueryClient()
    const { user } = useAuth()

    const { mutate: toggle } = useMutation({
        mutationFn: toggleWishListing,
        onMutate: async (carId: string) => {
            await qc.cancelQueries({
                queryKey: queryKeys.wishlist(user.id)
            })

            const previous = qc.getQueryData(queryKeys.wishlist(user.id))

            qc.setQueryData(queryKeys.wishlist(user.id),
                (old) => {
                    if (!old) return [carId]
                    
                    if (old.includes(carId))
                        return old.filter(id => id !== carId)

                    return [...old, carId]
                }
            )

            return { previous }
        },

        onError: (_, __, context) => {
            if (context?.previous) {
                qc.setQueryData(
                    queryKeys.wishlist(user.id),
                    context.previous
                )
            }
        }
    })

    return { toggle }
}