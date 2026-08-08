'use server'

import { cookies } from 'next/headers'
import { keystoneFetch } from '@/lib/keystone'

export async function logoutAction() {
	try {
		const res = await keystoneFetch(`mutation Mutation { endSession }`)
		
		if (!res.endSession) {
			return { suceess: false, error: 'Logout Failed' }
		}

		const cookieStore = await cookies()
		cookieStore.delete('keystonejs-session')

		return { success: true, error: null }
	} catch (err) {
		return { success: false, error: 'Logout Failed' }
	}
}