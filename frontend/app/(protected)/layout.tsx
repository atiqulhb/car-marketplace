import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuthedUser } from '@/lib/keystone'

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  
  const user = await getAuthedUser()
	if (!user) {
     const headersList = await headers()
    const pathname = headersList.get('x-pathname') ?? '/'
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }

  return <>{children}</>
}