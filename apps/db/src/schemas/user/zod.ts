import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { users } from './schema.ts'

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  password: z.string(),
})

export type InsertIntoUsersInput = z.infer<typeof insertUserSchema>
