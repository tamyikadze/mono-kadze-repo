'use server'

import { loginInputSchema } from '@apps/api/zod'
import { signIn } from '@repo/sdk/auth'
import { z } from 'zod'

export const login = async (data: z.infer<typeof loginInputSchema>) => {
  await signIn('credentials', data)
}
