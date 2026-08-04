'use client'

import { useRouter} from 'next/navigation'
import { useState, useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query/query-keys'
import { register } from '@/actions/register'
import styles from './page.module.css'

export default function Register() {
	const router = useRouter()
	const queryClient = useQueryClient()

	const [error, setError] = useState(null)
	const [registerAs, setRegisterAs] = useState('USER')
	const [state, action, isPending] = useActionState(register, { user: null, error: null })

	useEffect(() => {
		if(state.user) {
			queryClient.setQueryData(queryKeys.authedUser, state.user)
			router.refresh()
			router.push('/')
		} else {
			console.log('failed')
			setError(state.error)
		}
	}, [state])

	return (
		<div className={styles.registerPageWrapper}>
			<form className={styles.formWrapper} action={action}>
				<input type="text" name="name" placeholder="Enter Name" required/>
				<input type="email" name="email" placeholder="Enter Email" required/>
				<input type="password" name="password" placeholder="Enter Password" required/>
				<input type="hidden" name="role" value={registerAs}/>
				<div className={styles.AccountType}>
					<span className={registerAs === 'USER' ? styles.Active : ''} onClick={() => setRegisterAs('USER')}>Individual Buyer</span>
					<span className={registerAs === 'DEALER' ? styles.Active : ''} onClick={() => setRegisterAs('DEALER')}>Dealer</span>
				</div>
				{registerAs === 'DEALER' && (
					<>					
						<input type="text" name="businessName" placeholder="Enter Business Name"/>
						<input type="text" name="address" placeholder="Enter Address"/>
						<input type="text" name="area" placeholder="Enter Area"/>
						<input type="text" name="city" placeholder="Enter City"/>
					</>
				)}
				{state.error && <p>{state.error}</p>}
				<button type="submit">Create An Account</button>
				<span>already has account?</span>
				<Link href="/login">Login</Link>
			</form>
		</div>
	)
}