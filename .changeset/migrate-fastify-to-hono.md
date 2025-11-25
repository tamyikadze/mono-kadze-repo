---
"@apps/api": minor
---

Migrate from Fastify to Hono web framework

- Replace Fastify with Hono for a more modern, Web Standards-based API
- Use `@hono/node-server` for Node.js runtime
- Use `@hono/trpc-server` for tRPC integration
- Simplify auth routes leveraging Hono's native Request/Response support
- Remove manual header conversion since Better Auth works natively with Web Standard APIs

Benefits:
- Smaller bundle size (~14KB vs Fastify's larger footprint)
- Web Standards compatibility (native Request/Response)
- Edge-ready (can deploy to Cloudflare Workers, Vercel Edge, etc.)
- Simpler, more intuitive API
