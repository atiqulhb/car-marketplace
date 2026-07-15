'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import login from '@/actions/login'
import styles from './page.module.css'

export default function Login() {
	const [state, action, isPending] = useActionState(login, { success: false, error: null })
	console.log(state && state)
	return (
		<div className={styles.loginPageWrapper}>
			<form className={styles.formWrapper} action={action}>
				<input type="email" name="email" placeholder="Email" required/>
				<input type="password" name="password" placeholder="Password" required/>
				<button type="submit">Log in</button>
				<span>or</span>
				<Link href="/register">Register</Link>
			</form>
		</div>
	)
}