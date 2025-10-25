import { betterAuth } from 'better-auth'
import { DB, drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt } from 'better-auth/plugins'

export const getAuth = ({ db }: { db: DB }) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [jwt()],
    trustedOrigins: ['http://localhost:3000'],
  })
