import { getSessionCookie } from '@repo/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}
