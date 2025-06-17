import { db, users } from '@apps/db'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { publicProcedure } from '../../trpc.ts'
import { loginInputSchema } from './schema.js'
import { generateTokens, verifyToken } from './util.ts'

const login = publicProcedure.input(loginInputSchema).mutation(async ({ input }) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  })

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new Error('Invalid email or password')
  }

  const { accessToken, refreshToken } = generateTokens({ email: user.email, userId: user.id })

  return { accessToken, expiresIn: 3600, refreshToken }
})

const generateAccessToken = publicProcedure
  .input(
    z.object({
      refreshToken: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const payload = verifyToken(input.refreshToken)
    if (payload) {
      const selectUsers = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      })

      if (!selectUsers) throw new Error('Invalid refresh token')

      const { exp, ...safePayload } = payload

      const { accessToken } = generateTokens(safePayload)

      return { accessToken, expiresIn: 3600 }
    }
    throw new Error('Invalid refresh token')
  })

export default {
  generateAccessToken,
  login,
}
