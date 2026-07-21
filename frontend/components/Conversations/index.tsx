'use client'

import styles from './styles.module.css'
import { useState } from 'react'
import SendMessage from '@/components/SendMessage'
import MessageBox from '@/components/MessageBox'
import useConversations from '@/hooks/useConversations'

export default function Conversations() {
     const [selectedConversationId, setSelectedConversationId] = useState(null)

    const conversations = useConversations()

    return(
        <div className={styles.ChatBox}>
            <div className={styles.ConversationsBox}>
                {conversations?.map(convo => (
                    <span key={convo.id} onClick={() => setSelectedConversationId(convo.id)}>{convo.participants[1].name}</span>
                ))}
            </div>
            <div className={styles.MessageBoxWrapper}>
                <div className={styles.MessagesBox}>
                    <MessageBox conversationId={selectedConversationId} />
                </div>
                <div className={styles.SendBox}>
                    <SendMessage conversationId={selectedConversationId}/>
                </div>
            </div>
        </div>
    )
}