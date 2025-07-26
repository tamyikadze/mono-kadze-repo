import { loginInputSchema } from '@apps/api/zod'
import NextAuth from 'next-auth'
import 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'

import { trpcClient } from '../trpc'

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError'
    user: {
      access_token?: string
    }
  }

  interface User {
    access_token: string
    expires_at: number
    refresh_token?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    error?: 'RefreshTokenError'
    expires_at: number
    refresh_token?: string
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      console.log(user)
      if (user) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          access_token: user.access_token,
          expires_at: user.expires_at,
          refresh_token: user.refresh_token,
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token')

        try {
          const res = await trpcClient().auth.generateAccessToken.mutate({
            refreshToken: token.refresh_token,
          })

          return {
            ...token,
            access_token: res.accessToken,
            expires_at: Math.floor(Date.now() / 1000 + res.expiresIn),
          }
        } catch (error) {
          console.error('Error refreshing access_token', error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError'
          return token
        }
      }
    },
    session({ session, token }) {
      session.error = token.error
      session.user.access_token = token.access_token
      return session
    },
  },
  cookies: {
    callbackUrl: {
      name: process.env.CALLBACK_URL_COOKIE_NAME,
    },
    csrfToken: {
      name: process.env.CSRF_TOKEN_COOKIE_NAME,
    },
    sessionToken: {
      name: process.env.SESSION_TOKEN_COOKIE_NAME,
    },
  },
  providers: [
    Credentials({
      authorize: async credentials => {
        const parsedCredentials = loginInputSchema.safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        const res = await trpcClient().auth.login.mutate({
          email,
          password,
        })

        return {
          access_token: res.accessToken,
          expires_at: Math.floor(Date.now() / 1000 + res.expiresIn),
          refresh_token: res.refreshToken,
        }
      },
      credentials: {
        email: {},
        password: {},
        role: {},
      },
    }),
  ],
})
