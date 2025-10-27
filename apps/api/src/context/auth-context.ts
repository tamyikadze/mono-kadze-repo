import { fromNodeHeaders } from '@repo/auth'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

import { auth } from '../auth'

export type AuthContext = Awaited<ReturnType<typeof createContext>>

export async function createContext(opts: CreateFastifyContextOptions) {
  // Convert Fastify headers to Headers object for Better Auth
  const headers = fromNodeHeaders(opts.req.headers)

  // Validate session using Better Auth
  const session = await auth.api.getSession({
    headers,
  })

  return {
    session: session?.session ?? null,
    user: session?.user ?? null,
  }
}
