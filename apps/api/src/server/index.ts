import cors from '@fastify/cors'
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'

import { createContext } from '../context/auth-context.js'
import { AppRouter, appRouter } from './router.js'

export const createServer = () => {
  const server = fastify({
    logger: true,
    maxParamLength: 5000,
  })

  server.register(cors, {
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
