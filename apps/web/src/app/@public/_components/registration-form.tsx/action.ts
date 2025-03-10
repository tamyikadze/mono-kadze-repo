'use server'

import {z} from "zod";
import { trpcClient } from '@repo/sdk';
import { insertUserSchema } from '../../../../../../db/src/schemas';

export const register = async (data: z.infer<typeof insertUserSchema>) => {
  console.log(data)
  const user = await trpcClient().user.create.mutate(data)
  return user
}
