// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { randomBytes } from 'crypto'

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
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

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document'
import { emitMessage } from './socket/features/chat/chat.event'
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from './.keystone/types'
import { type Lists } from '.keystone/types'

export const lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      ownedCars: relationship({ ref: 'Car.dealer', many: true }),
      posts: relationship({ ref: 'Post.author', many: true }),
      conversations: relationship({ ref: 'Conversation.participants', many: true }),
      wishlist: relationship({ ref: 'WishList.user' }),
      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.posts',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: 'Tag.posts',

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
  Car: list({
    access: allowAll,
    fields: {
      brand: text(),
      model: text(),
      year: integer(),
      price: decimal({ precision: 12, scale: 3}),
      images: relationship({ ref: 'Image', many: true }),
      dealer: relationship({ ref: 'User.ownedCars' }),
      slug: text({ isIndexed: 'unique' }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    hooks: {
      resolveInput: async ({ resolvedData, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const { brand, model } = resolvedData;
          if (brand && model) {
            const base = `${brand}-${model}`.toLowerCase().replace(/\s+/g, '-');
            const suffix = randomBytes(3).toString('hex')
            const slug = `${base}-${suffix}`
           return { ...resolvedData, slug };
          }
        }
        return resolvedData;
      },
    },
  }),
  Image: list({
    access: allowAll,
    fields: {
      image: image({ storage: 'local_images'})
    }
  }),
  Brand: list({
    access: allowAll,
    fields: {
      name: text(),
      models: relationship({ ref: 'Model.brand', many: true }),
    },
  }),
  Model: list({
    access: allowAll,
    fields: {
      name: text(),
      brand: relationship({ ref: 'Brand.models' }),
    },
  }),
  FuelType: list({
    access: allowAll,
    fields: {
      name: text(),
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
