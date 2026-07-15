import { useChatSocket } from "@/hooks/socket/useChatSocket"
import { useMessages } from "../hooks/useMessages"
import styles from './MessageBox.module.css'
import { useAuth } from "@/hooks/useAuth"

export default function MessageBox({ conversationId }) {
    const { user } = useAuth()
    const messages = useMessages(conversationId)
    useChatSocket(conversationId)
   
    return (
        <div className={styles.Box}>
            <div className={styles.Messages}>
                {messages?.data?.map(({ id, content, sender }) => (
                <span key={id} style={ sender.id === user.id ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }}>{content}</span>
            ))}
            </div>   
        </div>
    )
}