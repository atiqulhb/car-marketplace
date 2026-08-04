'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { login } from '@/actions/login'
import styles from './Login.module.css'
import { queryKeys } from '@/lib/react-query/query-keys'

export default function Login() {
	const router = useRouter()
	const queryClient = useQueryClient()

	const [error, setError] = useState(null)
	const [state, action, isPending] = useActionState(login, { user: null, error: null })

	useEffect(() => {
		if(state.user) {
			queryClient.setQueryData(queryKeys.authedUser, state.user)
			router.refresh()
			router.push('/')
		} else {
			console.log('failed')
			setError(state.error)
		}
	},[state])
	return (
		<div className={styles.loginPageWrapper}>
			<form className={styles.formWrapper} action={action}>
				<input type="email" name="email" placeholder="Email" required/>
				<input type="password" name="password" placeholder="Password" required/>
				{error && <p>{error}</p>}
				<button type="submit">Log in</button>
				<span>or</span>
				<Link href="/register">Register</Link>
			</form>
		</div>
	)
}