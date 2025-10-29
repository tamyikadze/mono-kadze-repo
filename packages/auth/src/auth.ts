import { betterAuth } from 'better-auth'
import { DB, drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { jwt } from 'better-auth/plugins'

export const getAuth = ({ db }: { db: DB }) =>
  betterAuth({
    baseURL: 'http://localhost:4000',
    database: drizzleAdapter(db, {
      provider: 'pg',
    }),
    emailAndPassword: {
      enabled: true,
    },
    logger: {
      disableColors: false,
      disabled: false,
      level: 'debug', // Enable debug logging to see all Better Auth operations
      log: (level, message, ...args) => {
        // Custom logging implementation with emoji for visibility
        const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '🔍'
        console.log(`${emoji} [Better Auth ${level.toUpperCase()}] ${message}`, ...args)
      },
    },
    plugins: [jwt(), nextCookies()],
    trustedOrigins: request => {
      console.log(request)

      return ['http://localhost:3000']
    },
  })
