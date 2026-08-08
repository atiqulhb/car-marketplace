'use client'

import Link from 'next/link'
import styles from './styles.module.css'
import useConversations from '@/hooks/useConversations'

export default function Conversations() {
    const conversations = useConversations()

    return(
        <ul className={styles.ConversationsBox}>
            {conversations?.map(conv => (
                <li key={conv.id}>
                    <Link href={`/conversations/${conv.id}`}>
                        {conv.participants[0].name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}