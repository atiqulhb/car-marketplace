import "server-only"

import { cache } from 'react'
import { cookies } from 'next/headers'
import { buildWhere } from '@/lib/buildWhere'
import { buildOrderBy } from '@/lib/buildOrderBy'
import { ADD_CAR_MUTATION, GET_CARS_QUERY, GET_CONVERSATIONS_QUERY, GET_MESSAGES_QUERY, SINGLE_CAR_QUERY, GET_ALL_BRANDS, GET_MODELS, ADD_BRAND_WITH_MODEL, ADD_MODEL_TO_BRAND } from '@/queries'
import { env } from '@/config/env'

export async function getSessionHeader() {
  const session = (await cookies()).get('keystonejs-session')
  return session ? { Cookie: `${session.name}=${session.value}` } : {}
}

export async function keystoneFetch(query: string, variables?: Record<string, unknown>) {
  const sessionHeader = await getSessionHeader()
  
  const res = await fetch(process.env.BACKEND_URL!, {
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
  const where = buildWhere(filters)
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
    },
    "participantsWhere": {
      "id": {
        "not": {
          "equals": user.id
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

export async function getAllBrands(cursor) {
  const take = 10
  const data = await keystoneFetch(GET_ALL_BRANDS,{
    "orderBy": [{ "name": 'asc' }, { id: 'asc' }],
    "skip": cursor ? 1 : 0,
    take,
    "cursor": { "id": cursor }
  })

  const brands = data?.brands

  const hasMore = brands.length > take
  const items = hasMore ? brands.slice(0, take): brands

  return { items, nextCursor: hasMore ? items[items.length -1].id : null }
}

export async function getModels(brand: string[]) {
  const data = await keystoneFetch(GET_MODELS, {
    "where": {
      ...(brand.length > 0 && { "brand": {
        "name": {
          "in": brand
        }
      }})
    },
    "orderBy": [{ "name": 'asc' }]
  })

  return data.models
}

export async function addBrandwithModel(brandName, modelName) {
  const data = await keystoneFetch(ADD_BRAND_WITH_MODEL, {
    "data": {
      "name": brandName,
      "models": {
        "create": [
          {
            "name": modelName
          }
        ]
      }
    }
  })

  return data.createBrand
}

export async function addModelToBrand(brandId, modelName) {
  const data = await keystoneFetch(ADD_MODEL_TO_BRAND, {
    "data": {
      "name": modelName,
      "brand": {
        "connect": {
          "id": brandId
        }
      }
    }
  })

  return data.createModel
}