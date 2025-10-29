import type { Metadata } from 'next'

import '@/style/globals.css'
import { getSession } from '@repo/auth/actions'
import { Spinner } from '@repo/ui'
import { cn } from '@repo/ui/lib'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

import { Provider } from '@/providers/provider.tsx'

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

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <Provider>
          <Suspense fallback={<Fallback />}>
            <Loader {...props} />
          </Suspense>
        </Provider>
      </body>
    </html>
  )
}

const Loader = async (props: LayoutProps<'/'>) => {
  const data = await getSession({ cookies: await cookies() })

  return !data ? props.public : props.protected
}

const Fallback = () => (
  <div className={'flex min-h-svh w-full items-center justify-center'}>
    <Spinner className={'size-24'} />
  </div>
)
