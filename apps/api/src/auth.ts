import { db } from '@apps/db'
import { getAuth } from '@repo/auth'

import { createServer } from './server'

export const auth = getAuth({ db })

export const setAuthRoute = (server: ReturnType<typeof createServer>) => {
  // Register authentication endpoint
  server.route({
    async handler(request, reply) {
      console.log('🟢 [Fastify] Auth request received')
      console.log('📍 [Fastify] URL:', request.url)
      console.log('📍 [Fastify] Method:', request.method)
      console.log(
        '📍 [Fastify] Full URL with host:',
        `http://${request.headers.host}${request.url}`,
      )
      console.log('🍪 [Fastify] Cookie header:', request.headers.cookie || '(no cookies)')
      console.log('📨 [Fastify] All headers:', request.headers)

      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`)
        console.log('🔗 [Fastify] Constructed URL:', url.toString())

        // Convert Fastify headers to standard Headers object
        // Properly handle array-valued headers (e.g., multiple set-cookie)
        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Append each value separately for array-valued headers
            value.forEach(v => headers.append(key, v))
          } else if (value) {
            headers.set(key, value.toString())
          }
        })

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          body: request.body ? JSON.stringify(request.body) : undefined,
          headers,
          method: request.method,
        })

        console.log('🚀 [Fastify] Calling auth.handler...')
        const startTime = Date.now()

        // Process authentication request
        const response = await auth.handler(req)

        console.log('⏱️  [Fastify] Auth handler took:', Date.now() - startTime, 'ms')
        console.log('📤 [Fastify] Response status:', response.status)
        console.log(
          '📤 [Fastify] Response headers:',
          Object.fromEntries(response.headers.entries()),
        )

        const responseText = response.body ? await response.text() : null
        console.log('📤 [Fastify] Response body:', responseText)

        // Forward response to client
        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))
        reply.send(responseText)

        console.log('✅ [Fastify] Response sent successfully')
      } catch (error: unknown) {
        console.error('❌ [Fastify] Error in auth handler:', error)
        if (error instanceof Error) {
          console.error('❌ [Fastify] Error stack:', error.stack)
        }
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
