import { db } from '@apps/db'
import { getAuth } from '@repo/auth'

import { createServer } from './server'

export const auth = getAuth({ db })

export const setAuthRoute = (server: ReturnType<typeof createServer>) => {
  // Register authentication endpoint
  server.route({
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`)

        // Convert Fastify headers to standard Headers object
        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString())
        })
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          body: request.body ? JSON.stringify(request.body) : undefined,
          headers,
          method: request.method,
        })
        // Process authentication request
        const response = await auth.handler(req)
        // Forward response to client
        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))
        reply.send(response.body ? await response.text() : null)
      } catch (error: unknown) {
        if (error) {
          // @ts-ignore
          server.log.error('Authentication Error:', error)
        }
        reply.status(500).send({
          code: 'AUTH_FAILURE',
          error: 'Internal authentication error',
        })
      }
    },
    method: ['GET', 'POST'],
    url: '/api/auth/*',
  })
}
