'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useAuthModalStore } from "@/stores/authModalStore"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useActionState, useState, useTransition } from "react"
import { Dialog } from "@/components/Dialog"
import login from "@/actions/login"
import styles from './styles.module.css'

export function LoginModal() {
    const { isOpen, pendingAction, close } = useAuthModalStore()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    console.log('pendingAction outsude handleSuccess', pendingAction)

    async function handleLoginSuccess() {
        console.log('inside handlesuccess')
        await queryClient.invalidateQueries({ queryKey: queryKeys.authedUser })
        console.log('after invalidate query and before router refresh')
       
        console.log('pendingAction inside handleSuccess', pendingAction)
        close()

        await pendingAction?.()
         router.refresh()
    }

    function onSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await login({ success: null}, formData)

            if (result.success) {
                console.log('login success')
                await handleLoginSuccess()
            } else {
                setError(result.error)
            }
        })
    }

    if (!isOpen) return null

    return (
        <Dialog>
            <form className={styles.Form} action={onSubmit}>
                <input type="email" name="email"/>
                <input type="password" name="password"/>
                {error && <p>{error}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

        </Dialog>
    )
}