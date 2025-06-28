import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { z } from 'zod/v4'

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
    console.error(error)
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
    console.error(error)
    return null
  }
}

const SALT_ROUNDS = 10 // The number of rounds to use for generating the salt

/**
 * Hashes a password with a unique salt.
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)

  return await bcrypt.hash(password, salt)
}

/**
 * Validates a plain text password against a hashed password.
 * @param password - The plain text password to validate.
 * @param hashedPassword - The hashed password to validate against.
 * @returns Whether the password is valid.
 */
export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
