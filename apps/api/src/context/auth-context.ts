import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import { auth } from '../auth'

export type AuthContext = Awaited<ReturnType<typeof createContext>>

export async function createContext(opts: FetchCreateContextFnOptions) {
  // Hono uses Web Standard Request, directly pass headers to Better Auth
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  })

  return {
    session: session?.session ?? null,
    user: session?.user ?? null,
  }
}
