'use server'

import { cookies } from 'next/headers'
import { keystoneFetch } from '@/lib/keystone'
import { LOGIN_MUTATION } from '@/queries'

export async function login(prevState: any, formData: FormData) {
  if (!formData) {
    return { user: null, error: 'No form data' }
  }

  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { user: null, error: 'Missing fields' }
  }

  try {
    const data = await keystoneFetch(LOGIN_MUTATION, { email, password })

    const { item, sessionToken, message } = data?.authenticateUserWithPassword

   if (sessionToken) {
       (await cookies()).set('keystonejs-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      return { user: item, error: null }
   }


    return { user: null, error: message ?? 'Login Failed' }

  } catch(err) {

    return { user: null, error: err instanceof Error ? err.message : 'Login Failed' }
  }
}