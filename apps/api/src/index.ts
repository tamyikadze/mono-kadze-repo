import { client } from '@apps/db'

import { createServer } from './server/index.ts'

client.connect()

const server = createServer()

;(async () => {
  try {
    await server.listen({ port: 4000 })
    console.log('Server is running on http://localhost:4000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
})()

export type { AppRouter, RouterInput, RouterOutput } from './server/router.ts'
