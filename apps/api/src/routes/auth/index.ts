import { router } from '../../trpc'
import { authMutation } from './mutation'
import { authQuery } from './query'

export const authRouter = router({
  ...authMutation,
  ...authQuery,
})
