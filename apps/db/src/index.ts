import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import * as Schemas from './schemas/index.ts'
const { Client } = pg

export const client = new Client({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: 5432,
  user: process.env.DB_USERNAME,
})

export const db = drizzle(client, {
  schema: Schemas,
})

export * from './schemas/index.ts'
