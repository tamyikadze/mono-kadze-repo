'use server'

import { insertUserSchema } from '@apps/db/zod'
import { signIn, trpcClient } from '@repo/sdk'
import { z } from 'zod/v4'

export const register = async (data: z.infer<typeof insertUserSchema>) => {
  const auth = await trpcClient().auth.register.mutate(data)

  await signIn('credentials', {
    ...auth,
  })
}
