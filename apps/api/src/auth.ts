import { db } from '@apps/db'
import { getAuth } from '@repo/auth'
import { Hono } from 'hono'

export const auth = getAuth({ db })

export const authRoutes = new Hono()

// Better Auth handler - Hono uses Web Standard Request/Response
// which Better Auth natively supports
authRoutes.all('/api/auth/*', async c => {
  console.log('🟢 [Hono] Auth request received')
  console.log('📍 [Hono] URL:', c.req.url)
  console.log('📍 [Hono] Method:', c.req.method)
  console.log('🍪 [Hono] Cookie header:', c.req.header('cookie') || '(no cookies)')

  try {
    console.log('🚀 [Hono] Calling auth.handler...')
    const startTime = Date.now()

    // Hono's request is already a Web Standard Request
    const response = await auth.handler(c.req.raw)

    console.log('⏱️  [Hono] Auth handler took:', Date.now() - startTime, 'ms')
    console.log('📤 [Hono] Response status:', response.status)

    console.log('✅ [Hono] Response sent successfully')
    return response
  } catch (error: unknown) {
    console.error('❌ [Hono] Error in auth handler:', error)
    if (error instanceof Error) {
      console.error('❌ [Hono] Error stack:', error.stack)
    }
    return c.json(
      {
        code: 'AUTH_FAILURE',
        error: 'Internal authentication error',
      },
      500,
    )
  }
})
