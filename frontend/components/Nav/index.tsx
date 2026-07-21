import Link from 'next/link'
import styles from './styles.module.css'

export default function Nav() {
  return (
    <nav className={styles.Nav}>
        <ul>
            <li>
                <Link href={{ pathname: '/' }}>Home</Link>
            </li>
        </ul>
        <ul>
            <li>
                <Link href={{ pathname: '/login' }}>Login</Link>
            </li>
        </ul>
    </nav>
  )
}
