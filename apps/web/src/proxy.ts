import { NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const publicPaths = ['/', '/sign-in', '/sign-up']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Fast cookie check - Better Auth uses 'better-auth.session_token' cookie
  // This is just for fast redirects; full session validation happens in layouts/pages
  const sessionCookie = request.cookies.get('better-auth.session_token')

  if (sessionCookie && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all paths except static files, API routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|resources).*)'],
}
