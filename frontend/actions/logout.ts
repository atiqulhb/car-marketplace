'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { keystoneFetch } from '@/lib/keystone'

export async function logoutAction() {
	try {
		await keystoneFetch(`mutation Mutation { endSession }`)
	} catch (err) {
		console.error('Ending session from server failed', err)
	}

	const cookieStore = await cookies()
	cookieStore.delete('keystonejs-session')

	revalidatePath('/', 'layout')
	redirect('/')
}