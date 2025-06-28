'use server'

import { loginInputSchema } from '@apps/api/zod'
import { trpcClient } from '@repo/sdk'
import { signIn } from '@repo/sdk/auth'
import { z } from 'zod/v4'

export const login = async (data: z.infer<typeof loginInputSchema>) => {
  const user = await trpcClient().auth.login.mutate(data)

  await signIn('credentials', user)
}
