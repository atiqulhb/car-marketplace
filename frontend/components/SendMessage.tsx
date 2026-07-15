'use client'

import { useSendMessage } from '@/hooks/useSendMessage'

import { Send } from 'lucide-react'
import styles from './SendMessage.module.css'
import { useState } from 'react'

export default function SendMessage({ conversationId }) {
    const { sendMessage } = useSendMessage()
    const [message, setMessage] = useState('')
    
    function handleSendingMessage() {
        sendMessage({ conversationId, message })
        setMessage('')
    }

    return (
        <div className={styles.Wrapper}>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Send onClick={handleSendingMessage} />
        </div>
    )
}