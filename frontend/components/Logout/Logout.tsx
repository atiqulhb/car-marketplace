'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { logoutAction } from '@/actions/logout'
import styles from './Logout.module.css'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/query-keys'

export default function Logout() {
    const router = useRouter()
    const queryClient = useQueryClient()

    async function handleLogout() {
        const result = await logoutAction()

        if (!result.success) {
            console.error(result.error)
            return
        }

        queryClient.setQueryData(queryKeys.authedUser, null)
        queryClient.clear()
        router.refresh()
        router.push('/')
    }
    
  return (
    <button className={styles.Button} onClick={handleLogout}>Logout</button>
  )
}