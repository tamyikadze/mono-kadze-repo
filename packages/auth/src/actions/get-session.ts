'use server'

import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const getSession = async ({ cookies }: { cookies: ReadonlyRequestCookies | string }) => {
  const apiUrl = `${process.env.BETTER_AUTH_URL || 'http://localhost:4000'}/api/auth/get-session`

  const response = await fetch(apiUrl, {
    credentials: 'include',
    headers: {
      Cookie: cookies.toString(),
    },
    method: 'GET',
  })

  return await response.json()
}
