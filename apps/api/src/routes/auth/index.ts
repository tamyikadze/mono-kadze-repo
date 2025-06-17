import { router } from '../../trpc.js'
import authMutations from './mutation.ts'
import authQueries from './query.ts'

export const authRouter = router({
  ...authQueries,
  ...authMutations,
})
