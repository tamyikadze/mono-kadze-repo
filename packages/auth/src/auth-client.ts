import { createAuthClient } from 'better-auth/react'

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: process.env.SERVER_URL ?? 'http://localhost:4000',
})
