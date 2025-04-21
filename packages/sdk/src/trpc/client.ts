/**
 * This is the client-side code that uses the inferred types from the server
 */
import {
  createTRPCClient,
  splitLink,
  httpBatchStreamLink,
  httpSubscriptionLink,
} from '@trpc/client';
import {AppRouter} from "@apps/api";

// Initialize the tRPC client
export const trpcClient = (props?: { accessToken?: string }) => createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({
        url: process.env.NEXT_PUBLIC_API_URL!,
      }),
      false: httpBatchStreamLink({
        url: process.env.NEXT_PUBLIC_API_URL!,
        headers: props?.accessToken ? { Authorization: `Bearer ${props.accessToken}` } : {},
      }),
    }),
  ],
});



