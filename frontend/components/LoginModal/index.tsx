'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useAuthModalStore } from "@/stores/authModalStore"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Dialog } from "@/components/Dialog"
import { login } from "@/actions/login"
import { X } from 'lucide-react'
import styles from './styles.module.css'

export function LoginModal() {
    const { isOpen, pendingAction, close } = useAuthModalStore()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await login({ user: null, error: null }, formData)
            if (result.user) {
                console.log('login success')
                queryClient.setQueryData(queryKeys.authedUser, result.user)
                close()
                await pendingAction?.()
                router.refresh()
            } else {
                setError(result.error)
            }
        })
    }

    if (!isOpen) return null

    return (
        <Dialog>
            <X className={styles.Close} size={20} strokeWidth={1} onClick={() => close()}/>
            <form className={styles.Form} action={onSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Enter email address"/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter password"/>
                {error && <p>{error}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

        </Dialog>
    )
}