import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import Conversations from '@/components/Conversations'
import { getConversations, getAuthedUser } from '@/lib/keystone'
import styles from './layout.module.css'

export default async function ConversationsLayout({ children }) {
  const user = getAuthedUser()
  const qc = getQueryClient()
  const data = await getConversations()

  qc.setQueryData([queryKeys.conversations(user.id)], data)
  return (
    <div className={styles.ConversationsWrapper}>
      <aside>
        <Conversations/>
      </aside>
      <main>
        {children}
      </main>
    </div>
  )
}
