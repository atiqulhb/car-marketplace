'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { keystoneFetch } from '@/lib/keystone'
import login from '@/actions/login'

export async function register(prevState: any, formData: FormData) {

  if (!formData) {
    return { success: false, error: 'No form data' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { success: false, error: 'Missing fields' }
  }

  const data = await keystoneFetch(
    `
      mutation Mutation($data: UserCreateInput!) {
        createUser(data: $data) {
          id
          name
          email
          password {
            isSet
          }
        }
      }
    `,
    { data: { name, email, password }}
  )


  if (data) {

    const authData = await keystoneFetch(
      `
        mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
          authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
              item {
                id
                name
                email
              }
              sessionToken
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }
      `,
      { email, password }
    )

    const { sessionToken, message } = authData?.authenticateUserWithPassword

    if (sessionToken) {
      (await cookies()).set('keystonejs-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      redirect('/')
    }

    if (message)

      return { success: false, error: message }
    }
}