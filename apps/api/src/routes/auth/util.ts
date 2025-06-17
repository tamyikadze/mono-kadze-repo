import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod'

const JWT_TOKEN = process.env.JWT_TOKEN!
if (!JWT_TOKEN) throw new Error('JWT_TOKEN is not set')

const TokenPayloadSchema = z.object({
  exp: z.number(),
  userId: z.coerce.number(), // User ID
})

export interface UserPayload {
  email: string
  userId: number
}

export function decodeAndVerifyJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN)
    const parsedPayload = TokenPayloadSchema.safeParse(decoded)
    if (!parsedPayload.success) {
      throw new Error('Invalid token payload')
    }
    return parsedPayload.data
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export function generateTokens(payload: UserPayload) {
  return {
    accessToken: jwt.sign(payload, JWT_TOKEN, { expiresIn: '8h' }),
    refreshToken: jwt.sign(payload, JWT_TOKEN, { expiresIn: '30d' }),
  }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_TOKEN) as JwtPayload & UserPayload
  } catch (error) {
    return null
  }
}
