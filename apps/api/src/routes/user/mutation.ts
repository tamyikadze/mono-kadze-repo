import { db, users } from '@apps/db'
import { insertUserSchema } from '@apps/db/zod'
import bcrypt from 'bcryptjs'

import { publicProcedure } from '../../trpc.ts'

const create = publicProcedure.input(insertUserSchema).mutation(async ({ input }) => {
  const hashedPassword = await bcrypt.hash(input.password, 10)

  const newUser = await db
    .insert(users)
    .values({ ...input, password: hashedPassword })
    .returning()

  return newUser[0]
})

export default {
  create,
}
