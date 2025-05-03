import { router } from '../../trpc.ts'
import userMutations from './mutation.ts'
import userQueries from './query.ts'

export const userRouter = router({
  ...userQueries,
  ...userMutations,
})
