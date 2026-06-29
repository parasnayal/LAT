# Repository Guidelines

## Project Shape

- This is a Next.js App Router frontend using TypeScript, Tailwind CSS, SCSS modules, React Query, Zustand, React Hook Form, and Zod.
- Keep `src/app` focused on route segments, layouts, route handlers, loading/error boundaries, and composition of feature components.
- Put business modules in `src/features/<feature>`. Feature code owns its API calls, hooks, services, schemas, store, types, and feature-only components.
- Put cross-feature primitives and utilities in `src/shared`, including layout, reusable UI, config, constants, HTTP clients, stores, types, and utilities.
- Use absolute imports through `@/*` aliases from `src`.

## Naming And Boundaries

- Use kebab-case for folders/files unless an existing feature already uses PascalCase component filenames.
- Use PascalCase for React components and camelCase for functions and variables.
- Prefer suffixes such as `*.types.ts`, `*.schema.ts`, `*.api.ts`, `*.service.ts`, and `*.store.ts` where they match the local pattern.
- Export stable feature contracts from `src/features/<feature>/index.ts`; avoid importing another feature's internals directly.
- Keep pages thin. Add business behavior to the owning feature or shared layer instead of route files.

## Styling And UI

- Reuse existing shared UI/components before adding new primitives.
- Existing feature screens often use SCSS modules for dense application UI; follow nearby component styling conventions.
- Tailwind is configured for source files under `src/**/*.{js,ts,jsx,tsx,mdx}`.
- Use `lucide-react` icons for icon buttons where suitable.

## Commands

- Install/use dependencies with Yarn when possible because the repo has `yarn.lock`.
- `yarn dev` starts the Next.js dev server.
- `yarn lint` runs ESLint.
- `yarn typecheck` runs `tsc --noEmit`.
- `yarn test` runs Vitest.
- `yarn test:e2e` runs Playwright. The Playwright config starts the dev server with `npm run dev`.
- `yarn format:check` checks Prettier formatting; `yarn format` writes formatting.

## Testing Guidance

- Use focused Vitest tests for shared utilities, feature services, hooks, and behavior that can be tested without a browser.
- Use Playwright for end-to-end route/workflow verification.
- When changing UI, run at least `yarn lint` and `yarn typecheck`; add or run targeted tests when behavior changes.

## Environment Notes

- `.env.example` is the public environment contract.
- Public environment variables must start with `NEXT_PUBLIC_`; server-only variables must not.
- Environment validation lives in `src/shared/config/env.ts`.

## Git Note

- In this workspace, Git may report "dubious ownership" until `C:/Users/USER88/Documents/LAT` is added as a safe directory for the current Windows user.
