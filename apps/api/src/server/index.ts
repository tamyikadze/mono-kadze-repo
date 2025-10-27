import cors from '@fastify/cors'
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'

import { createContext } from '../context/auth-context.js'
import { AppRouter, appRouter } from './router.js'

export const createServer = () => {
  const server = fastify({
    maxParamLength: 5000,
  })

  server.register(cors, {
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Must specify exact origin when credentials: true (cannot use '*')
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  })

  server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      createContext,
      onError({ error, path }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error)
      },
      router: appRouter,
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  })

  return server
}
