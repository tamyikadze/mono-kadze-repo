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
    origin: '*',
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
