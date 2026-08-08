'use client'

import { useChatSocket } from "@/hooks/socket/useChatSocket"
import { useMessages } from "../../hooks/useMessages"
import styles from './styles.module.css'
import { useAuth } from "@/hooks/useAuth"

export default function MessageBox({ conversationId }) {
    const { user } = useAuth()
    const messages = useMessages(conversationId)
    useChatSocket(conversationId)
   
    return (
        <div className={styles.Box}>
            <div className={styles.Messages}>
                {messages?.data?.map(({ id, content, sender }) => (
                <span key={id} style={{ alignSelf: `${sender.id === user.id ? 'flex-end' : 'flex-start'}` }}>{content}</span>
            ))}
            </div>   
        </div>
    )
}