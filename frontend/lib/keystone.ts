import "server-only"

import { cache } from 'react'
import { cookies } from 'next/headers'
import { newBuildWhere } from '@/lib/newbuildWhere'
import { buildOrderBy } from '@/lib/buildOrderBy'
import { ADD_CAR_MUTATION, GET_CARS_QUERY, GET_CONVERSATIONS_QUERY, GET_MESSAGES_QUERY, SINGLE_CAR_QUERY } from '@/queries'
import { env } from '@/config/env'

export async function getSessionHeader() {
  const session = (await cookies()).get('keystonejs-session')
  return session ? { Cookie: `${session.name}=${session.value}` } : {}
}

export async function keystoneFetch(query: string, variables?: Record<string, unknown>) {
  const sessionHeader = await getSessionHeader()

  
  const res = await fetch(env.BACKEND_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollo-require-preflight": 'true',
      ...sessionHeader
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  })
  

 if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${res.statusText} — ${text}`)
  }

  const json = await res.json().catch(() => {
    throw new Error('Invalid JSON response from server')
  })
  
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join(', ')
    )
  }

  return json.data
}

export const getAuthedUser = cache(async () => {
  try {
    const data = await keystoneFetch(`
      query AuthenticatedItem {
        authenticatedItem {
          ... on User {
            id
            name
          }
        }
      }
    `)

    return data.authenticatedItem ?? null
  } catch (error) {
    console.error('Error fetching authenticated user:', error)
    throw new Error('Failed to fetch authenticated user')
  }
})



export async function fetchCars(filters, cursor) {
  const where = newBuildWhere(filters)
  const orderBy = buildOrderBy(filters)
  const take = 12

  const res = await fetch(env.BACKEND_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: GET_CARS_QUERY,
      variables: {
        where,
        take: 12,
        skip: cursor ? 1 : 0,
        orderBy,
        cursor: cursor ? { id: cursor } : undefined,
      },
    }),
  });


  const { data, errors } = await res.json();

  if (errors?.length) {
    throw new Error(
      errors.map((e: { message: string }) => e.message).join(', ')
    )
  }
  const cars = data.cars ?? [];
  const nextCursor = cars.length === take ? cars.at(-1)!.id : null

  return { items: cars, nextCursor }
}


export async function addCarMutation(data) {
  const res = await keystoneFetch(ADD_CAR_MUTATION, { data })
  const { data: mutationData, errors } = await res.json()

  if (errors?.length) {
    throw new Error(
      errors.map((e: { message: string }) => e.message).join(', ')
    )
  }

  return mutationData.createCar
}

export async function getConversations() {
  const user = await getAuthedUser()
  console.log('user from get conversations query', user)

  const data = await keystoneFetch(GET_CONVERSATIONS_QUERY, {
    "where": {
      "participants": {
        "some": {
          "id": {
            "equals": user.id
          }
        }
      }
    }
  })

  return data.conversations
}

export async function getMessages(conversationId: string) {
  console.log('got inside getMessages')
  const data = await keystoneFetch(GET_MESSAGES_QUERY, {
    "where": {
      "conversation": {
        "id": {
          "equals": conversationId
        }
      }
    }
  })

  console.log('messages data inside getMesssages', data)

  return data.messages
}

export const getWishlist = cache(async () => {
  const user = await getAuthedUser()
  try {
    const data = await keystoneFetch(`
      query WishList($where: WishListWhereUniqueInput!) {
  wishList(where: $where) {
    id
    cars {
      id
    }
  }
}
    `,
  {
  "where": {
    "user": {
      "id": user.id
    }
  }
})

    return data.wishList?.cars?.map(({ id }) => id)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    throw new Error('Failed to fetch wishlist')
  }
})

export async function getCarInformations(slug) {
  return (await keystoneFetch(SINGLE_CAR_QUERY, { where: { slug } })).car
}

// export async function getSingleProduct(id) {
//   const res = await fetch('http://localhost:3000/api/graphql', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       query: `
//         query Product($where: ProductWhereUniqueInput!) {
//           product(where: $where) {
//             id
//             title
//             brand {
//               name
//             }
//             categories {
//               name
//             }
//             price
//             images {
//               id
//               source {
//                 id
//                 url
//               }
//             }
//             shortDescription
//             fullDescription
//             rating
//             slug
//             createdAt
//           }
//         }
//       `,
//       variables: { where: { id }}
//     }),
//     next: {
//       revalidate: 30,
//       tags: [`products-${id}`]
//     }
//   })

//   const { data, error } = await res.json()

//     if (error) {
//     console.error("Graphql Errors", error);
//     throw new Error("Failed to fetch single product")
//   }

//   return data.product
// }

// export async function getPriceRange() {
//   const res = await fetch('http://localhost:3000/api/graphql', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       query: `
//         query PriceRange {
//           priceRange {
//             min
//             max
//           }
//         }
//       `,
//     }),
//     next: { revalidate: 60 }
//   })

//   const { data, error } = await res.json()

//   if (error) {
//     console.error("Graphql Errors", error);
//     throw new Error("Failed to fetch price range")
//   }
    
//   return data.priceRange
// }