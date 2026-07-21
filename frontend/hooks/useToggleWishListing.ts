import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleWishListing } from '@/actions/toggleWishListing'
import { queryKeys } from "@/lib/react-query/query-keys";
import { useAuth } from "./useAuth";

export function useToggleWishListing() {
    const qc = useQueryClient()

    const { mutate: toggle, mutateAsync: toggleAsync } = useMutation({
        mutationFn: toggleWishListing,
        onMutate: async (carId: string) => {
        const authUser = qc.getQueryData(queryKeys.authedUser)

            if (!authUser) return
            
            console.log('authedUser in onMutate', authUser)

            const wishListKey = queryKeys.wishlist(authUser.id)

            await qc.cancelQueries({ queryKey: wishListKey })

            const previous = qc.getQueryData(wishListKey)

            qc.setQueryData(wishListKey, (old) => {
                if (!old) return [carId]
                
                if (old.includes(carId))
                    return old.filter(id => id !== carId)

                return [...old, carId]
            })

            return { previous, wishListKey }
        },

        onError: (_, __, context) => {
            if (context?.previous && context?.wishListKey) {
                qc.setQueryData(context.wishListKey, context.previous)
            }
        }
    })

    return { toggle, toggleAsync }
}