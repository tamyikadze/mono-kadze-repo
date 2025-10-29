import { protectedProcedure } from '../../trpc.ts'

const hello = protectedProcedure.query(({ ctx }) => {
  return 'hello'
})

export const protectedQueries = {
  hello,
}
