import { getSessionCookie } from '@repo/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  console.log(sessionCookie)
  // if (!sessionCookie && request.nextUrl.pathname !== '/') {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  return NextResponse.next()
}
