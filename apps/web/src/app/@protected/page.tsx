'use client'

import { signOut } from '@repo/auth'
import { useTRPC } from '@repo/sdk'
import { Button } from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function Page() {
  const trpc = useTRPC()

  const { data, error, isPending } = useQuery(trpc.hello.queryOptions())

  const router = useRouter()

  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>Me</h2>
      {isPending ? 'loading' : data}
      <Button
        onClick={() => {
          signOut()
          router.push('/')
        }}
      >
        Sign out
      </Button>
    </div>
  )
}
