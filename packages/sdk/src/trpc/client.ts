import { AppRouter } from '@apps/api'
/**
 * This is the client-side code that uses the inferred types from the server
 */
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from '@trpc/client'

// Initialize the tRPC client
export const trpcClient = (props?: { accessToken?: string }) =>
  createTRPCClient<AppRouter>({
    links: [
      splitLink({
        condition: op => op.type === 'subscription',
        false: httpBatchStreamLink({
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: 'include',
            })
          },
          url: process.env.NEXT_PUBLIC_API_URL! + '/trpc',
        }),
        true: httpSubscriptionLink({
          url: process.env.NEXT_PUBLIC_API_URL! + '/trpc',
        }),
      }),
    ],
  })
