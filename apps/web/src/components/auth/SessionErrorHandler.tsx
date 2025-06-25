'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface SessionErrorHandlerProps {
  children: React.ReactNode
}

export function SessionErrorHandler({ children }: SessionErrorHandlerProps) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.error === 'RefreshTokenError') {
      signOut({ callbackUrl: '/login', redirect: true })
    }
  }, [session, status])

  return <>{children}</>
}
