import SendMessage from '@/components/SendMessage'
import MessageBox from '@/components/MessageBox'
import styles from './page.module.css'

export default async function ConversationPage({ params }) {
    const { id } = await params
  return (
    <div className={styles.MessageBoxWrapper}>
        <div className={styles.MessagesBox}>
            <MessageBox conversationId={id} />
        </div>
        <div className={styles.SendBox}>
            <SendMessage conversationId={id}/>
        </div>
    </div>
  )
}
