import { db, users } from '@apps/db'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod/v4'

import { publicProcedure } from '../../trpc.ts'
import { generateTokens, hashPassword, validatePassword, verifyToken } from './util.ts'
import { loginInputSchema, tokenSchema } from './zod.ts'

const login = publicProcedure
  .input(loginInputSchema)
  .output(tokenSchema)
  .mutation(async ({ input }) => {
    const selectUsers = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    })

    if (!selectUsers) throw new Error('Invalid email')

    if (!(await validatePassword(input.password, selectUsers.password))) {
      throw new Error('Invalid email or password')
    }

    const { accessToken, refreshToken } = generateTokens({
      email: selectUsers.email,
      userId: selectUsers.id,
    })

    return { accessToken, expiresIn: 3600, id: selectUsers.id, refreshToken }
  })

const generateAccessToken = publicProcedure
  .input(
    z.object({
      refreshToken: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    // Authenticate user against your database or authentication service

    const payload = verifyToken(input.refreshToken)

    if (payload) {
      const selectUsers = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
      })

      if (!selectUsers) throw new Error('Invalid refresh token')

      const { accessToken } = generateTokens({
        email: selectUsers.email,
        userId: selectUsers.id,
      })

      return { accessToken, expiresIn: 3600 }
    }
    throw new Error('Invalid refresh token')
  })

const register = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .output(tokenSchema)
  .mutation(async ({ input }) => {
    const newUser = await db.transaction(async tx => {
      const selectUsers = await tx
        .select()
        .from(users)
        .where(and(eq(users.email, input.email)))

      if (selectUsers.length) throw new Error('Email already exists')

      const newUser = await tx
        .insert(users)
        .values({
          ...input,
          password: await hashPassword(input.password),
        })
        .returning()

      if (!newUser) {
        tx.rollback()
        throw new Error('Error creating user')
      }

      return newUser[0]
    })

    const { accessToken, refreshToken } = generateTokens({
      email: newUser.email,
      userId: newUser.id,
    })

    return { accessToken, expiresIn: 3600, refreshToken }
  })

const loginOrRegister = publicProcedure
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ input }) => {
    const user = await db.query.users.findFirst({
      where: (user, { and, eq }) => and(eq(user.email, input.email)),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    })

    return user ? 'login' : 'register'
  })

export const authMutation = {
  generateAccessToken,
  login,
  loginOrRegister,
  register,
}
