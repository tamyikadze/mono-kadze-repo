'use server'

import { insertUserSchema } from '@apps/db/zod'
import { trpcClient } from '@repo/sdk'
import { z } from 'zod'

export const register = async (data: z.infer<typeof insertUserSchema>) => {
  console.log(data)
  const user = await trpcClient().user.create.mutate(data)
  return user
}
