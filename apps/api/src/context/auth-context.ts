import { decodeAndVerifyJwtToken } from '../routes/auth/util.js'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export async function createContext(opts: CreateFastifyContextOptions) {
  async function getUserFromHeader() {
    if (opts.req.headers.authorization) {
      return decodeAndVerifyJwtToken(opts.req.headers.authorization.split(' ')[1])
    }
    return null
  }

  const user = await getUserFromHeader()

  return {
    user,
  }
}

export type AuthContext = Awaited<ReturnType<typeof createContext>>
