import { getAuthedUser } from '@/lib/keystone'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const user = await getAuthedUser()

	if (user) {
		redirect('/')
	}

	return children
}