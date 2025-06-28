import type { Config } from 'drizzle-kit'

export default {
  dbCredentials: {
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    password: process.env.DB_PASSWORD || '',
    port: 5432,
    ssl: false,
    user: process.env.DB_USERNAME || '',
  },
  dialect: 'postgresql',
  out: './src/migrations',
  schema: ['./src/**/*/zod.ts'],
  strict: true,
  verbose: true,
} satisfies Config
