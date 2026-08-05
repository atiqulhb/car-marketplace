import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  decimal,
  image,
} from '@keystone-6/core/fields'

import { emitMessage } from './socket/features/chat/chat.event'

import { type Lists } from '.keystone/types'

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      role: select({
        type: 'enum',
        options: [
          { label: 'User', value: 'USER' },
          { label: 'Dealer', value: 'DEALER' },
          { label: 'Admin', value: 'ADMIN' },
        ],
        defaultValue: 'USER',
      }),
      ownedCars: relationship({ ref: 'Car.dealer', many: true }),
      conversations: relationship({ ref: 'Conversation.participants', many: true }),
      wishlist: relationship({ ref: 'WishList.user' }),
      dealershipInfo: relationship({ ref: 'DealerShipInfo.dealer' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  DealerShipInfo: list({
    access: allowAll,
    fields: {
      dealer: relationship({ ref: 'User.dealershipInfo' }),
      businessName: text(),
      address: text(),
      area: text(),
      city: text()
    }
  }),
  Car: list({
    access: allowAll,
    fields: {
      brand: relationship({ ref: 'Brand.cars' }),
      model: relationship({ ref: 'Model.cars' }),
      year: integer(),
      fuelType: relationship({ ref: 'FuelType.cars' }),
      price: decimal({ precision: 12, scale: 3 }),
      images: relationship({ ref: 'Image', many: true }),
      dealer: relationship({ ref: 'User.ownedCars' }),
      slug: text({ isIndexed: 'unique' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Image: list({
    access: allowAll,
    fields: {
      image: image({ storage: 'local_images' })
    }
  }),
 Brand: list({
    access: allowAll,
    fields: {
      name: text(),
      models: relationship({ ref: 'Model.brand', many: true }),
      cars: relationship({ ref: 'Car.brand', many: true })
    }
  }),
  Model: list({
    access: allowAll,
    fields: {
      name: text(),
      brand: relationship({ ref: 'Brand.models' }),
      cars: relationship({ ref: 'Car.model', many: true })
    }
  }),
  FuelType: list({
    access: allowAll,
    fields: {
      name: text(),
      cars: relationship({ ref: 'Car.fuelType', many: true })
    },
  }),
  Conversation: list({
    access: allowAll,
    fields: {
      participants: relationship({ ref: 'User.conversations', many: true }),
      messages: relationship({ ref: 'Message.conversation', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Message: list({
    access: allowAll,
    fields: {
      sender: relationship({ ref: 'User' }),
      conversation: relationship({ ref: 'Conversation.messages' }),
      content: text(),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    hooks: {
      async afterOperation({ context, operation, item}) {
        if (operation !== 'create') return

        console.log(item)

        const message = await context.query.Message.findOne({
          where: {
            id: item.id
          },
          query: `
              id
        content
        sender {
          id
          name
        }
          `
        })

        emitMessage(item.conversationId, message)
      },
    }
  }),
  WishList: list({
    access: allowAll,
    fields: {
      user: relationship({ ref: 'User.wishlist' }),
      cars: relationship({ ref: 'Car', many: true })
    }
  })
} satisfies Lists
