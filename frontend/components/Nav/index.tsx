'use client'

import Link from 'next/link'
import styles from './styles.module.css'
import { useAuth } from '@/hooks/useAuth'
import Logout from '@/components/Logout/Logout'

export default function Nav() {
    const { user } = useAuth()
  return (
    <nav className={styles.Nav}>
        <ul>
            <li>
                <Link href={{ pathname: '/' }}>Home</Link>
            </li>
        </ul>
        <ul>
            { user ? (
                <>
                <li>
                    <Link href={{ pathname: '/profile'}}>Profile</Link>
                </li>
                <li>
                    <Logout/>
                </li>
                </>
            ) : (
                <>
                <li>
                    <Link href={{ pathname: '/login' }}>Login</Link>
                </li>
                <li>
                    <Link href={{ pathname: '/register'}}>Create An Account</Link>
                </li>
                </>
            )} 
        </ul>
    </nav>
  )
}
