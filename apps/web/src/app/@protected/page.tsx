'use client'

import { useTRPC } from '@repo/sdk'
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const trpc = useTRPC()

  const me = useQuery(trpc.auth.me.queryOptions())

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>Me</h2>
      {me.data && (
        <div>
          <p>User ID: {me.data.id}</p>
          <p>Email: {me.data.email}</p>
          <p>{me.data.firstName}</p>
        </div>
      )}
    </div>
  )
}
