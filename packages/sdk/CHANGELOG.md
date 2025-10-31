# @repo/sdk

## 2.0.0

### Minor Changes

- [#15](https://github.com/tamyikadze/mono-kadze-repo/pull/15) [`f631e9f`](https://github.com/tamyikadze/mono-kadze-repo/commit/f631e9f44844c391ffa7a9e46b64adbdd5624123) Thanks [@ybtam](https://github.com/ybtam)! - Migrate authentication system to Better Auth

  ## Major Changes

  - **Authentication Package (`@repo/auth`)**: Implement Better Auth with email/password provider, session management, and React hooks for client/server integration
  - **API (`@apps/api`)**: Integrate Better Auth routes with Fastify, add protected API endpoints with authentication middleware, and update auth context
  - **Web App (`web`)**: Restructure authentication routes with dedicated sign-in/sign-up pages, implement auth-based parallel routes (@protected/@public), and add middleware proxy for route protection

  ## Minor Changes

  - **SDK (`@repo/sdk`)**: Update tRPC client with improved error handling for authentication
  - **UI (`@repo/ui`)**: Reorganize spinner component and update theme variables
  - **Database (`@apps/db`)**: Prepare for Better Auth schema integration

  ## Configuration

  - Add Better Auth environment variables
  - Update Next.js config with experimental features
  - Update Turbo config for improved caching

### Patch Changes

- [#14](https://github.com/tamyikadze/mono-kadze-repo/pull/14) [`0d8dbfe`](https://github.com/tamyikadze/mono-kadze-repo/commit/0d8dbfe7f9c5848bc354450a30cc89d7f3f13f0f) Thanks [@ybtam](https://github.com/ybtam)! - bump dep versions

- Updated dependencies [[`f631e9f`](https://github.com/tamyikadze/mono-kadze-repo/commit/f631e9f44844c391ffa7a9e46b64adbdd5624123), [`0d8dbfe`](https://github.com/tamyikadze/mono-kadze-repo/commit/0d8dbfe7f9c5848bc354450a30cc89d7f3f13f0f)]:
  - @apps/api@1.1.0
