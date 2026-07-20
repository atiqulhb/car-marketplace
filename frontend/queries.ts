import "server-only"

export const ADD_CAR_MUTATION = `mutation Mutation($data: CarCreateInput!) {
  createCar(data: $data) {
    id
  }
}`

export const GET_CARS_QUERY = `
  query Cars($where: CarWhereInput!, $orderBy: [CarOrderByInput!]!, $take: Int, $skip: Int!, $cursor: CarWhereUniqueInput) {
    cars(where: $where, orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor) {
      id
      brand
      model
      year
      price
      images {
        image {
          url
        }
      }
      slug
    }
  }
`

export const GET_CONVERSATIONS_QUERY = `
    query Conversations($where: ConversationWhereInput!) {
      conversations(where: $where) {
        id
        participants {
          id
          name
        }
      }
    }
  `

export const GET_MESSAGES_QUERY = `
  query Messages($where: MessageWhereInput!) {
    messages(where: $where) {
      id
      content
      sender {
        id
        name
      }
    }
  }
`

export const SEND_MESSAGE_MUTATION = `mutation Mutation($data: MessageCreateInput!) {
  createMessage(data: $data) {
    id
    content
    conversation {
      id
    }
    sender {
      id
      name
    }
  }
}`

export const LOGIN_MUTATION =  `
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
      `


export const SINGLE_CAR_QUERY = `
  query Query($where: CarWhereUniqueInput!) {
    car(where: $where) {
      id
      brand
      model
      year
      price
      images {
        image {
          url
        }  
      }
      dealer {
        id
        name
      }
    }
  }
`