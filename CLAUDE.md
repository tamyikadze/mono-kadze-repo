# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo built with Turborepo, pnpm workspaces, and Next.js 16. The project implements a full-stack application with authentication using Better Auth, a Fastify-based API with tRPC, and a PostgreSQL database managed with Drizzle ORM.

## Common Commands

### Development

```bash
# Start all development servers (Next.js web app and Fastify API)
pnpm dev

# Start specific workspace
pnpm --filter web dev           # Next.js app on port 3000
pnpm --filter @apps/api dev     # Fastify API on port 4000
pnpm --filter @apps/db dev      # Drizzle Studio on port 4001
```

### Build & Type Checking

```bash
# Build all workspaces
pnpm build

# Lint and type-check (recommended before commits)
pnpm check

# Run checks for CI
pnpm check:ci

# Type-check only
pnpm type-check
```

### Database Operations

```bash
# Create database (first-time setup)
pnpm --filter @apps/db db:create

# Run migrations
pnpm migrate:up

# Generate new migration
pnpm --filter @apps/db migration:new

# Push schema changes directly (dev only)
pnpm --filter @apps/db db:push

# Open Drizzle Studio
pnpm --filter @apps/db dev

# Generate Better Auth schema
pnpm --filter @apps/db auth:generate-schema
```

### Testing & Linting

```bash
# Run tests
pnpm test

# Lint
pnpm lint

# Lint with auto-fix
pnpm lint:fix
```

### Docker

```bash
# Start PostgreSQL database
docker-compose -f .docker/docker-compose.local-dev.yaml up -d

# Stop database
docker-compose -f .docker/docker-compose.local-dev.yaml down
```

## Architecture

### Monorepo Structure

The repository uses a workspace-based architecture with three main categories:

- **apps/**: Deployable applications
  - `web`: Next.js 16 frontend with React 19, App Router with parallel routes
  - `api`: Fastify backend with tRPC integration
  - `db`: Drizzle ORM schemas and migrations

- **packages/**: Shared libraries
  - `ui`: Tailwind v4 + shadcn/ui components
  - `auth`: Better Auth configuration (shared between web and api)
  - `sdk`: tRPC client and React Query integration
  - `config-*`: Shared ESLint, TypeScript, and Prettier configs

### Application Flow

1. **Authentication**: Better Auth library handles auth across both web and api
   - Auth instance created in `packages/auth/src/auth.ts` using `getAuth({ db })`
   - API exports auth at `apps/api/src/auth.ts` (Fastify routes)
   - Web imports auth from `@apps/api/auth` for session management
   - Middleware at `apps/web/src/proxy.ts` protects routes

2. **Next.js App Structure**: Uses parallel routes for auth-based rendering
   - Root layout (`apps/web/src/app/layout.tsx`) has `@protected` and `@public` slots
   - Currently routing is in development (see line 48-50 in layout.tsx)
   - Sign-in route: `apps/web/src/app/@public/sign-in/`
   - Sign-up route: `apps/web/src/app/@public/sign-up/`

3. **API Communication**:
   - Frontend uses tRPC client from `@repo/sdk`
   - Backend exposes tRPC router at `/trpc` endpoint
   - Router defined in `apps/api/src/server/router.ts` (currently empty)
   - CORS configured to allow `CLIENT_ORIGIN` (default: http://localhost:3000)

4. **Database Architecture**:
   - Drizzle ORM with PostgreSQL adapter
   - Connection configured in `apps/db/src/index.ts`
   - Schemas organized under `apps/db/src/schemas/`
   - Better Auth schemas auto-generated in `apps/db/src/schemas/auth/schema.ts`
   - Migration files in `apps/db/src/migrations/`

### Key Technical Decisions

- **Node.js 22+** required (specified in root package.json engines)
- **pnpm 10.19.0** as package manager
- **Turbo** for build orchestration and caching
- **TypeScript 5.9.3** across all workspaces
- **React 19** with React Compiler enabled (babel-plugin-react-compiler)
- **Tailwind CSS v4** (new CSS-first architecture)
- **Better Auth** instead of NextAuth (currently migrating, see branch name)

### Environment Variables

Required variables (see `.env.example`):

- Database: `DB_HOST`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- Auth: `AUTH_SECRET`, `AUTH_TRUST_HOST`
- API URLs: `NEXT_PUBLIC_API_URL`, `API_URL`, `CLIENT_ORIGIN`
- Better Auth: Cookie names and `BETTER_AUTH_URL`, `SERVER_URL`

All environment variables are loaded via `dotenv-cli` in turbo dev script.

### Workspace Dependencies

Critical dependency patterns:

- Web app imports from: `@repo/sdk`, `@repo/auth`, `@repo/ui`, and `@apps/api/auth`
- API imports from: `@apps/db` and `@repo/auth`
- DB package imports from: `@repo/auth` (for Better Auth integration)
- SDK has peer deps on `@apps/api` for type imports

### Database Migrations

When modifying database schemas:

1. Update schema files in `apps/db/src/schemas/*/schema.ts`
2. Generate migration: `pnpm --filter @apps/db migration:new`
3. Review migration in `apps/db/src/migrations/`
4. Apply migration: `pnpm migrate:up`

For Better Auth schema changes:
```bash
pnpm --filter @apps/db auth:generate-schema
```

### UI Components

The `@repo/ui` package uses:
- Radix UI primitives
- shadcn/ui patterns (use `pnpm --filter @repo/ui shadcn` to add components)
- Tailwind v4 with CSS variables in `packages/ui/src/styles/theme.css`
- Components export from `packages/ui/src/components/index.ts`

Import paths:
- Components: `@repo/ui/components`
- Utils: `@repo/ui/lib` (includes `cn()` helper)
- Styles: `@repo/ui/styles.css` or `@repo/ui/theme.css`

## Claude Code Integration

### MCP Servers

This repository has the **next-devtools** MCP server configured in `.mcp.json`, providing specialized Next.js 16 tooling:

**Available Tools:**

1. **nextjs_runtime** - Query runtime information from Next.js dev server's MCP endpoint
   - Get compilation errors, runtime diagnostics, route information
   - List and call Next.js MCP tools (errors, logs, cache info, etc.)
   - Auto-discovers running Next.js servers on localhost
   - **Use proactively** before implementing changes to understand current app state

2. **browser_eval** - Browser automation with Playwright
   - Navigate pages, click elements, execute JavaScript
   - Take screenshots, get console messages
   - **Critical for Next.js**: Use instead of curl to verify pages (renders JS, detects hydration issues)
   - Automatically installs Playwright if needed

3. **nextjs_docs** - Search Next.js official documentation
   - Searches MCP knowledge base first (Next.js 16 resources)
   - Falls back to official docs if not found
   - Access to guides, API reference, best practices

4. **upgrade_nextjs_16** - Guided upgrade to Next.js 16
   - Runs official codemod first (requires clean git state)
   - Handles async API changes, config migration, deprecated features
   - Manual guidance for remaining issues

5. **enable_cache_components** - Complete Cache Components setup
   - Updates configuration, starts dev server with MCP
   - Detects errors via browser automation and Next.js MCP
   - Automated fixing: Suspense boundaries, "use cache" directives
   - Validates all routes with zero errors

**Next.js 16 Knowledge Base Resources:**
- Overview & Critical Errors
- Core Mechanics (cacheComponents, three types of rendering)
- Public/Private Caches ("use cache" vs "use cache: private")
- Runtime Prefetching & Request APIs
- Cache Invalidation (updateTag, revalidateTag)
- Advanced Patterns (cacheLife, cacheTag, draft mode)
- Build Behavior & Error Patterns
- Test-Driven Patterns (125+ fixtures)
- 'use client' Directive Understanding
- Dynamic vs Static Rendering
- Beta to Stable Migration

**When to Use:**
- Before implementing Next.js features: Check runtime state and existing implementation
- Debugging: Query errors and logs from running dev server
- Testing routes: Use browser automation to verify full rendering
- Learning Next.js 16: Access knowledge base resources
- Migrations: Use upgrade and cache component tools

---

This repository also has the **better-auth** MCP server configured, providing specialized authentication framework assistance:

**Available Tools:**

1. **search** - Semantic search across Better Auth's knowledge base
   - Natural language queries for finding specific information
   - Search modes: `fast` (quick results), `balanced` (moderate depth), `deep` (comprehensive)
   - Configurable result limit (1-100 results)
   - Returns ranked results by relevance with context
   - **Use for**: Finding specific Better Auth APIs, patterns, or implementation details

2. **chat** - Conversational AI assistant for Better Auth
   - Multi-turn conversations with context retention
   - Deep understanding of Better Auth documentation
   - Can synthesize information across multiple documents
   - Provides reasoned responses and explanations
   - **Use for**: Complex questions, explanations, best practices guidance

3. **list_files** - Browse Better Auth knowledge base files
   - Lists all available documentation and reference files
   - Returns file IDs for retrieval
   - **Use for**: Discovering available documentation resources

4. **get_file** - Retrieve specific documentation files
   - Downloads complete file contents by ID
   - Handles text and binary formats (base64 encoded)
   - Preserves original formatting
   - **Use for**: Reading complete guides, extracting specific sections

**Important Notes:**
- Better Auth is NOT NextAuth - they are completely different packages
- Always reference Better Auth's knowledge base for accurate API usage
- The MCP provides access to comprehensive Better Auth documentation

**When to Use:**
- Implementing authentication features: Search for specific Better Auth APIs and patterns
- Understanding auth flows: Use chat for explanations of session management, providers, etc.
- Troubleshooting auth issues: Search for error patterns or known issues
- Learning Better Auth: Browse files and chat for comprehensive guides
- Migration from other auth libraries: Search for migration patterns and best practices

### Recommended Claude Code Agents

**For TypeScript/JavaScript:**
- `typescript-pro` - Advanced types, generics, strict type safety for complex type systems
- `javascript-pro` - Modern ES6+, async patterns, Node.js APIs for optimization

**For Frontend:**
- `frontend-developer` - React 19, Next.js 16, responsive layouts, state management, performance
- `ui-ux-designer` - Design systems, component libraries, accessibility standards

**For Backend:**
- `backend-architect` - tRPC router design, Fastify patterns, API architecture
- `nodejs-backend-patterns` - Express/Fastify middleware, error handling, authentication
- `graphql-architect` - If adding GraphQL alongside tRPC (schema design, resolvers)

**For Database:**
- `database-architect` - Drizzle schema design, technology selection, data modeling
- `database-optimizer` - Query optimization, indexing, N+1 resolution, performance tuning

**For Testing & Quality:**
- `test-automator` - Test automation with modern frameworks, TDD/BDD workflows
- `javascript-testing-patterns` - Jest/Vitest strategies for TypeScript/React
- `code-reviewer` - Pre-commit code quality, security, performance analysis

**For DevOps & Deployment:**
- `deployment-engineer` - CI/CD pipelines, GitOps, deployment automation
- `debugger` - Error resolution, test failures, unexpected behavior

**For Documentation:**
- `api-documenter` - OpenAPI/tRPC documentation, developer portals
- `docs-architect` - Technical documentation from codebases

### Workflow Examples

**Adding a New tRPC Endpoint:**
1. Use `backend-architect` agent to design the endpoint structure and validation
2. Update `apps/api/src/server/router.ts` with new procedures
3. Use `typescript-pro` for complex input/output types
4. Use `test-automator` to create endpoint tests
5. Use `code-reviewer` before committing

**Creating a Database Migration:**
1. Use `database-architect` to design schema changes
2. Update schema in `apps/db/src/schemas/*/schema.ts`
3. Generate migration: `pnpm --filter @apps/db migration:new`
4. Use `database-optimizer` to review indexes and performance
5. Apply migration: `pnpm migrate:up`

**Building a New Next.js Route:**
1. Use `nextjs_runtime` MCP tool to check existing routes and structure
2. Use `frontend-developer` agent to build components with React 19 patterns
3. Use `browser_eval` MCP tool to test the route in a real browser
4. Query `nextjs_docs` for Next.js 16-specific patterns (Server Components, caching)
5. Use `code-reviewer` to validate before committing

**Debugging Next.js Errors:**
1. Use `nextjs_runtime` with action='list_tools' to discover available diagnostic tools
2. Call specific tools (e.g., get errors, logs, route info)
3. Use `browser_eval` to capture console errors and screenshots
4. Use `debugger` agent to analyze and fix issues
5. Verify fix with `browser_eval` again

**Optimizing Database Queries:**
1. Use Drizzle Studio: `pnpm --filter @apps/db dev`
2. Use `database-optimizer` to analyze slow queries
3. Implement indexes or query changes
4. Use `test-automator` to add performance tests
5. Generate and apply migration

**Upgrading Dependencies:**
1. Use `dependency-upgrade` agent for major version changes
2. For Next.js 16: Use `upgrade_nextjs_16` MCP tool with codemod
3. Use `test-automator` to ensure no regressions
4. Use `code-reviewer` for final validation

**Implementing Better Auth Features:**
1. Use Better Auth MCP `search` tool to find relevant APIs and patterns
2. Use `chat` tool for complex auth flow questions and best practices
3. Implement in `packages/auth/src/auth.ts` or route handlers
4. Use `backend-architect` for Fastify integration patterns
5. Use `frontend-developer` for Next.js client-side auth components
6. Test with `browser_eval` to verify auth flows work end-to-end
7. Use `code-reviewer` to validate security best practices

### Current Development Status

Based on git status, the repository is on `feature/move-to-better-auth` branch with:
- Better Auth setup in progress
- Sign-in/sign-up pages relocated from `_components` to dedicated routes
- Auth context being updated in API
- Middleware proxy for route protection implemented but authentication flow still in development
