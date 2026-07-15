'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/actions/register'
import styles from './page.module.css'

export default function Register() {
	const [state, action, isPending] = useActionState(register, { success: false, error: null })

	return (
		<div className={styles.registerPageWrapper}>
			<form className={styles.formWrapper} action={action}>
				<input type="text" name="name" placeholder="Name" required/>
				<input type="email" name="email" placeholder="Email" required/>
				<input type="password" name="password" placeholder="Password" required/>
				{state.error && <p>{state.error}</p>}
				<button type="submit">Create An Account</button>
				<span>already has account?</span>
				<Link href="/login">Login</Link>
			</form>
		</div>
	)
}