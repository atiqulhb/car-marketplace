'use client'

import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { getSocket } from "@/lib/socket"
import { queryKeys } from "@/lib/react-query/query-keys"

export function useChatSocket(conversationId: string) {
    const qc = useQueryClient()

    useEffect(() => {

        if (!conversationId) return 
        
        const socket = getSocket()

        socket.emit('conversation:join', conversationId)

        const handleNewMessage = (message) => {
            console.log('new message has arrived', message)
            qc.setQueryData(
               queryKeys.messages(conversationId),
                (old => {
                    if (old.some(m => m.id === message.id)) {
                        return old
                    }

                    return [...old, message]
                })
            )
        }

        socket.on('message:new', handleNewMessage)

        return () => {
            socket.emit('conversation:leave', conversationId)
            socket.off('message:new', handleNewMessage)
        }
    }, [conversationId, qc])
}