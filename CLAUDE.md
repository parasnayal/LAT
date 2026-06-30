# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **Yarn** (the repo has `yarn.lock`; `package-lock.json` also exists but Yarn is the team standard).

- `yarn dev` — start the Next.js dev server (http://localhost:3000)
- `yarn build` / `yarn start` — production build / serve
- `yarn lint` / `yarn lint:fix` — ESLint
- `yarn typecheck` — `tsc --noEmit`
- `yarn test` — run Vitest once
- `yarn test:watch` — Vitest watch mode
- `yarn test src/test/unit/shared/foo.test.ts` — run a single test file
- `yarn test -t "name"` — run tests matching a name
- `yarn test:e2e` — Playwright (its config auto-starts the dev server via `npm run dev`)
- `yarn format:check` / `yarn format` — Prettier (includes Tailwind class sorting)

Husky + `lint-staged` run on pre-commit. After UI/logic changes, run at least `yarn lint` and `yarn typecheck`.

## Architecture

Next.js App Router + TypeScript, feature-first. Three top-level layers under `src`, with absolute imports via `@/*` (also `@/app/*`, `@/features/*`, `@/shared/*`, `@/test/*`).

- **`src/app`** — routing only: route groups `(auth)`, `(protected)`, `(student-assessment)`, layouts, loading/error boundaries, and `api/` route handlers. Pages should compose feature components, not hold business logic.
- **`src/features/<feature>`** — business modules (auth, curriculum, assessments, questions, roles, permissions, users, student-test, etc.). Each owns its `api/`, `components/`, `hooks/`, `schemas/`, `services/`, `store/`, `types/`. Export stable contracts from `index.ts`; **do not import another feature's internals**.
- **`src/shared`** — cross-feature primitives: `components/` (UI primitives + `rbac`, `feedback`, `layout`, `toast`), `lib/`, `services/`, `config/`, `constants/`, `hooks/`, `types/`, `utils/`, `styles/`.

> The `README.md` documents the _intended_ scaffold; the actual tree is larger and has diverged in places (e.g. shared components use PascalCase folder names like `Button/`, `Modal/`). Match the conventions of nearby existing files rather than the README's idealized tree.

### Auth & RBAC

- Auth state is carried in cookies named in `src/features/auth/constants/auth.constants.ts` (token, roles, permissions).
- **`src/proxy.ts`** holds the route-guard logic: it checks the session cookie, matches `PROTECTED_ROUTE_PREFIXES` / `PUBLIC_ROUTE_PREFIXES`, and enforces per-route policies from `src/shared/constants/route-policies.ts` using `hasAllPermissions` and `allowedRoles`. Note: there is **no `middleware.ts`** wiring `proxy` in yet — treat client/route guards as the active enforcement and re-check authorization server-side.
- Permission/role logic lives in `src/shared/lib/rbac.ts` (`hasPermission`, `hasAnyPermission`, `hasAllPermissions`, serialize/parse helpers) driven by `ROLE_PERMISSION_MAP` in `src/shared/constants/rbac.ts`. RBAC-gated UI uses `src/shared/components/rbac`.

### HTTP / backend access

Two patterns coexist:

1. **Client → external API directly**: `src/shared/services/http/fetch-client.ts` (and `axios-client.ts`) call `NEXT_PUBLIC_API_BASE_URL`, attach the bearer token from the auth cookie, and normalize errors into `ApiError` (`api-error.ts`). Feature `api/*.api.ts` files wrap these into small typed functions.
2. **BFF proxy routes**: handlers under `src/app/api/lat/[...path]/route.ts` proxy to the internal backend (`API_INTERNAL_BASE_URL`, default `https://faq-admin.projectinclusion.in`), injecting auth from the cookie or `LAT_API_BEARER_TOKEN`. Other `api/` routes (`generate`, `rag`, `rbac`, `validate`, `dashboard`) follow the same server-side pattern.

### AI / LAT pipeline

- `src/shared/lib/lat/agent.ts` + `config.ts` implement a question-generation/validation agent (grade configs, subject distribution, retries) typed via `src/shared/types/lat.ts`.
- `src/shared/lib/rag/` (`pinecone.ts`, `chunk.ts`) and `src/shared/lib/gemini.ts` back retrieval-augmented generation, exposed through `api/rag` and `api/generate`. `src/features/AgentController` drives this from the UI.

### Config & env

Environment is validated with Zod in `src/shared/config/env.ts`: `clientEnv` (only `NEXT_PUBLIC_*`) is safe everywhere; `serverEnv` (with `API_INTERNAL_BASE_URL`, `AUTH_COOKIE_NAME`, `LAT_API_BEARER_TOKEN`) is `null` in the browser. `src/shared/config/site.ts` holds app metadata.

## Conventions

- Suffix files by intent where the local pattern uses them: `*.types.ts`, `*.schema.ts`, `*.api.ts`, `*.service.ts`, `*.store.ts`.
- Server components by default; add `"use client"` only for interactivity/browser APIs/state.
- Zod schemas are the runtime boundary for forms (with React Hook Form), env vars, and external responses.
- Dense application screens often use **SCSS modules**; reusable design-system UI uses Tailwind. Follow the styling of the component you're editing.
- State: feature-local Zustand stores live in the feature; React Query (`queryClient.ts`) handles server state.

## Testing

- Vitest (jsdom, globals on, setup at `src/test/setup.ts`) for units/components — `src/test/unit`, `src/test/integration`.
- Playwright (`src/test/e2e`, chromium only) for end-to-end flows.
