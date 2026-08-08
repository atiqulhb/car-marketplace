'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { logoutAction } from '@/actions/logout'
import styles from './Logout.module.css'
import { useQueryClient } from '@tanstack/react-query'

export default function Logout() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isPending, startTransition] = useTransition()

    async function handleLogout() {
      startTransition(async () => {
        const result = await logoutAction()

        if (!result.success) {
            console.error(result.error)
            return
        }

        queryClient.clear()
        router.push('/')
      })
    }
    
  return (
    <button className={styles.Button} onClick={handleLogout} disabled={isPending}>
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  )
}