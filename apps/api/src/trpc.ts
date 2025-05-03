import { initTRPC, TRPCError } from '@trpc/server'

import { AuthContext } from './context/auth-context.ts'

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<AuthContext>().create()
export const router = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async function isAuthed({ ctx, next }) {
  if (!ctx.user) {
    //     ^?
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})
