import { z } from 'zod'
import { createInsertSchema } from 'drizzle-zod'
import { users } from './schema.ts'

export const insertUserSchema = createInsertSchema(users, {
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  password: z.string(),
})

export type InsertIntoUsersInput = z.infer<typeof insertUserSchema>
