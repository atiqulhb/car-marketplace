// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core'
import { env } from './config/env'

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema'

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth'
import { initializeSocket } from './socket'

export default withAuth(
  config({
    ui: { isDisabled: true },
    db: {
      provider: 'postgresql',
      url: env.DATABASE_URL,
    },
    lists,
    session,
    server: {
      cors: {
        origin: [env.FRONTEND_URL],
        credentials: true
      },
      extendHttpServer: (server, commonContext) => initializeSocket(server, commonContext)
    },
    storage: {
      local_images: {
        kind: 'local',
        type: 'image',
        storagePath: 'public/images',
        generateUrl: path => `/images${path}`,
        serverRoute: {
          path: '/images',
        },
      },
    },
  })
)
