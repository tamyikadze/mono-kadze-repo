import * as trpcNext from '@trpc/server/adapters/next';
import { decodeAndVerifyJwtToken } from '../utils/jwt.ts';

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = decodeAndVerifyJwtToken(
        req.headers.authorization.split(' ')[1],
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
}
export type AuthContext = Awaited<ReturnType<typeof createContext>>;