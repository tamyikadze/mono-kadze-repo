'use client'

import { SdkProvider } from '@repo/sdk'
import { PropsWithChildren } from 'react'

export const Provider = ({ children, ...props }: PropsWithChildren<{ accessToken?: string }>) => {
  return <SdkProvider {...props}>{children}</SdkProvider>
}
