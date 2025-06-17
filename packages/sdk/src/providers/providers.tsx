'use client'

import { ReactNode } from 'react'

import { trpcClient } from '../trpc'
import { TanstackProvider } from './tanstack-provider.tsx'
import { TRPCProvider } from './trpc-provider.ts'

export const SdkProvider = ({
  accessToken,
  children,
}: {
  accessToken?: string
  children: ReactNode
}) => {
  return (
    <TanstackProvider>
      {queryClient => (
        <TRPCProvider queryClient={queryClient} trpcClient={trpcClient({ accessToken })}>
          {children}
        </TRPCProvider>
      )}
    </TanstackProvider>
  )
}
