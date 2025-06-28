import { z } from 'zod/v4'

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const tokenSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.coerce.number(),
  refreshToken: z.string(),
})
