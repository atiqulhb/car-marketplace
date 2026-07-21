import { create } from 'zustand'

export const useAuthModalStore = create((set) => ({
    isOpen: false,
    pendingAction: null,
    open: (pendingAction) => set({ isOpen: true, pendingAction: pendingAction ?? null }),
    close: () => set({ isOpen: false, pendingAction: null })
}))