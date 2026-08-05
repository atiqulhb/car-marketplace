'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { keystoneFetch } from '@/lib/keystone'

export async function logoutAction() {
	try {
		const res = await keystoneFetch(`mutation Mutation { endSession }`)
		
		if (!res.endSession) {
			return { suceess: false, error: 'Logout Failed' }
		}

		const cookieStore = await cookies()
		cookieStore.delete('keystonejs-session')

		// revalidatePath('/', 'layout')

		return { success: true, error: null }
	} catch (err) {
		console.error('Ending session from server failed', err)
		return { success: false, error: 'Logout Failed' }
	}
}