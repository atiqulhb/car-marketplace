'use client'

import { queryKeys } from "@/lib/react-query/query-keys"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"

export default function useConversations() {
    const { user } = useAuth()
    console.log('user data from useConverastion hook', user)
    const { data } = useQuery({
        queryKey: queryKeys.conversations(user?.id),
        queryFn: async () => {
            console.log('start queryFn inside of useConversations')
            const res = await fetch('/api/conversations')
            const data = await res.json()
            console.log('response from queryFn inside of useConversations', data)
            return data
        },
        enabled: !!user
    })

    console.log(data)
    return data
}