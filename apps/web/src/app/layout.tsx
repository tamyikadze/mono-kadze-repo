import type { Metadata } from 'next'

import { auth } from '@repo/sdk'

import '@/style/globals.css'
import { cn } from '@repo/ui/lib'
import { Geist, Geist_Mono } from 'next/font/google'
import { ReactNode } from 'react'

import { Provider } from '@/providers/provider'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  description: 'Make your projects management easier',
  title: 'Manage your projects',
}

export default async function RootLayout({
  protected: protectedApp,
  public: publicApp,
}: Readonly<{
  protected: ReactNode
  public: ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <Provider accessToken={session?.user?.access_token}>
          {!session ? publicApp : protectedApp}
        </Provider>
      </body>
    </html>
  )
}
