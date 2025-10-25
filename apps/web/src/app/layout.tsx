import type { Metadata } from 'next'

import '@/style/globals.css'
import { auth } from '@apps/api/auth'
import { cn } from '@repo/ui/lib'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'

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
}: LayoutProps<'/'>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  console.log(session)

  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <Provider>{!session ? publicApp : protectedApp}</Provider>
      </body>
    </html>
  )
}
