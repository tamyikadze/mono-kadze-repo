import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { routes } from '../routes'
import { router } from '../trpc.js'

export const appRouter = router(routes)

// Export type router type signature, this is used by the client.
export type AppRouter = typeof appRouter

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
