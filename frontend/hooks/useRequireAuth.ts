import { useAuth } from "./useAuth"
import { useAuthModalStore } from "@/stores/authModalStore"

export function useRequireAuth() {
    const { user } = useAuth()
    const openModal = useAuthModalStore((s) => s.open)

    return function requireAuth(action) {
        if (user) {
            action()
        } else {
            openModal(action)
        }
    }
}