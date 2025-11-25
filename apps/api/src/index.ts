import { serve } from '@hono/node-server'
import { client } from '@apps/db'

import { authRoutes } from './auth.ts'
import { createApp } from './server'

client.connect()

const app = createApp()

// Mount auth routes
app.route('/', authRoutes)

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)

export type { AppRouter, RouterInput, RouterOutput } from './server/router.ts'
