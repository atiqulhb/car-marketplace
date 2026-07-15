'use server'

import { keystoneFetch } from "@/lib/keystone"

export async function toggleWishListing(carId: string) {
    const { authenticatedItem } = await keystoneFetch(
        `
            query AuthenticatedItem {
                authenticatedItem {
                    ... on User {
                        id
                        wishlist {
                            id
                        }
                    }
                }
            }
        `
    )

    console.log(authenticatedItem)

    if (!authenticatedItem) {
        throw new Error ('not logged in')
    }

    if (authenticatedItem.wishlist) {
        const res = await keystoneFetch(
            `
                query WishLists($where: WishListWhereInput!) {
                wishLists(where: $where) {
                    id
                }
                }
            `,
            {
  "where": {
    "AND": [
      {
        "user": {
          "id": {
            "equals": authenticatedItem.id
          }
        },
        "cars": {
          "some": {
            "id": {
              "equals": carId
            }
          }
        }
      }
    ]
  }
}
        )

    console.log('state of car being in the wishlist', res.wishLists.length)

    const AddOrRemoveRes = await keystoneFetch(
        `
            mutation Mutation($where: WishListWhereUniqueInput!, $data: WishListUpdateInput!) {
  updateWishList(where: $where, data: $data) {
    id
  }
}
        `,
        {
  "where": {
    "id": authenticatedItem.wishlist.id
  },
  "data": {
    "cars": {
      ...(res.wishLists.length > 0 ? { "disconnect": [
        {
          "id": carId
        }
      ]} : {
      "connect": [
        {
          "id": carId
        }
      ]})
    }
  }
}
    )
    } else {
        const res = await keystoneFetch(
            `
               mutation CreateWishList($data: WishListCreateInput!) {
                    createWishList(data: $data) {
                        id
                    }
                } 
            `,
            {
                "data": {
                    "user": {
                    "connect": {
                        "id": authenticatedItem.id
                    }
                    },
                    "cars": {
                    "connect": [
                        {
                            "id": carId
                        }
                    ]
                    }
                }
            }
        )

        console.log('state of creating new wishlist', res)
    }

    return { isWishListed: null }
}