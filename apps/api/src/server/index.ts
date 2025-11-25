import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { createContext } from '../context/auth-context.js'
import { appRouter } from './router.js'

export type HonoApp = ReturnType<typeof createApp>

export const createApp = () => {
  const app = new Hono()

  // CORS middleware
  app.use(
    '*',
    cors({
      credentials: true,
      maxAge: 86400,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    }),
  )

  // tRPC handler
  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        console.error(`Error in tRPC handler on path '${path}':`, error)
      },
    }),
  )

  return app
}
