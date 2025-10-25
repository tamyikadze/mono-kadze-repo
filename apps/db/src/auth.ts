import { getAuth } from '@repo/auth'
import { db } from './index.ts'

export const auth = getAuth({ db })
