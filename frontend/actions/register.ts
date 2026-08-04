'use server'

import { cookies } from 'next/headers'
import { keystoneFetch } from '@/lib/keystone'
import { login } from '@/actions/login'

export async function register(prevState: any, formData: FormData) {

  if (!formData) {
    return { user: null, error: 'No form data' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const businessName = formData.get('businessName') as string
  const address = formData.get('address') as string
  const area = formData.get('area') as string  
  const city = formData.get('city') as string

  if (!name || !email || !password) {
    return { user: null, error: 'Missing fields' }
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
    {
      data: {
        name,
        email,
        password,
        role,
        ...(role === 'DEALER' && {
          dealershipInfo: {
            create: {
              businessName,
              address,
              area,
              city
            }
          }
        })
      }
    }
  )
  console.log(data)

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

    const {item, sessionToken, message } = authData?.authenticateUserWithPassword

    if (sessionToken) {
      (await cookies()).set('keystonejs-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })

      return { user: item, error: null }
    }

    if (message)

      return { user: null, error: message }
    }

}