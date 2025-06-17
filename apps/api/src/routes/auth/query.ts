import { db, users } from '@apps/db'
import { eq } from 'drizzle-orm'

import { protectedProcedure } from '../../trpc.js'

const me = protectedProcedure.query(async ({ ctx }) => {
  return db.query.users.findFirst({
    columns: {
      password: false,
    },
    where: eq(users.id, ctx.user.userId),
  })
})

export default {
  me,
}
