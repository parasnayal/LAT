# Next.js Feature-Based Architecture

This repository is scaffolded as a scalable production frontend using Next.js App Router,
TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod, and a shared HTTP API layer.

## Architecture Principles

- Organize by feature first. Business modules live in `src/features`.
- Keep `src/app` focused on routing, layouts, route handlers, metadata, loading states, and error boundaries.
- Keep reusable application code in `src/shared`.
- Prefer explicit module boundaries through `index.ts` exports.
- Use kebab-case for folders and files, PascalCase for React component names, camelCase for functions, and `*.types.ts`, `*.schema.ts`, `*.api.ts`, `*.service.ts`, `*.store.ts` suffixes for clear intent.
- Keep feature-specific UI inside the feature. Promote UI to `shared/components` only when it is reused by multiple features.

## Recommended Folder Tree

```txt
.
+-- .env.example
+-- .husky/
|   +-- pre-commit
+-- eslint.config.mjs
+-- lint-staged.config.cjs
+-- next.config.mjs
+-- package.json
+-- playwright.config.ts
+-- prettier.config.cjs
+-- tailwind.config.ts
+-- tsconfig.json
+-- vitest.config.ts
+-- src/
    +-- app/
    |   +-- (auth)/
    |   |   +-- layout.tsx
    |   |   +-- login/
    |   |       +-- page.tsx
    |   +-- (protected)/
    |   |   +-- layout.tsx
    |   |   +-- dashboard/
    |   |   |   +-- error.tsx
    |   |   |   +-- loading.tsx
    |   |   |   +-- page.tsx
    |   |   +-- profile/page.tsx
    |   |   +-- settings/page.tsx
    |   |   +-- users/page.tsx
    |   +-- api/
    |   |   +-- health/route.ts
    |   +-- error.tsx
    |   +-- global-error.tsx
    |   +-- layout.tsx
    |   +-- loading.tsx
    |   +-- not-found.tsx
    |   +-- page.tsx
    |   +-- providers.tsx
    +-- features/
    |   +-- auth/
    |   |   +-- api/
    |   |   +-- components/
    |   |   +-- constants/
    |   |   +-- hooks/
    |   |   +-- schemas/
    |   |   +-- services/
    |   |   +-- store/
    |   |   +-- types/
    |   |   +-- index.ts
    |   +-- dashboard/
    |   +-- profile/
    |   +-- settings/
    |   +-- user-management/
    +-- shared/
    |   +-- components/
    |   |   +-- feedback/
    |   |   +-- layout/
    |   |   +-- ui/
    |   +-- config/
    |   +-- constants/
    |   +-- hooks/
    |   +-- services/
    |   |   +-- http/
    |   +-- store/
    |   +-- styles/
    |   +-- types/
    |   +-- utils/
    +-- proxy.ts
    +-- test/
        +-- e2e/
        +-- integration/
        +-- setup.ts
        +-- unit/
```

## Folder Responsibilities

`src/app` contains App Router route segments, route groups, layouts, route handlers, loading
states, error boundaries, metadata, and top-level providers. Pages should compose feature
components instead of containing business logic.

`src/features` contains business modules. Each feature owns its API calls, components, hooks,
schemas, services, store slices, types, and constants. A large feature can add subfolders such as
`lib`, `queries`, `mutations`, or `server` when needed.

`src/shared/components/ui` contains reusable design-system primitives such as buttons, inputs,
menus, tabs, modals, and form controls.

`src/shared/components/layout` contains reusable layout shells and navigation structures used by
multiple routes.

`src/shared/components/feedback` contains reusable loading, empty, error, toast, and skeleton
states.

`src/shared/hooks` contains generic hooks that do not know about a business feature.

`src/shared/utils` contains pure helper functions such as formatting, class merging, date helpers,
and object utilities.

`src/shared/constants` contains cross-feature constants such as route names and app-wide limits.

`src/shared/types` contains cross-feature TypeScript contracts such as API envelopes and pagination.

`src/shared/services/http` contains API clients, interceptors, error mapping, and request helpers.
The scaffold includes both `fetchClient` and `axiosClient`; choose one as the team standard.

`src/shared/config` validates environment variables and centralizes app configuration.

`src/shared/store` contains state-management helpers. Feature-level Zustand stores stay inside
their feature folders.

`src/proxy.ts` contains route protection for modern Next.js versions. Keep authentication redirects
and high-level request guards here, then enforce authorization again in your API/backend.

`src/test` separates unit, integration, and e2e tests. Co-located tests can also be used for very
feature-specific behavior.

## Feature Module Convention

```txt
src/features/example-feature/
+-- api/              # HTTP calls for this feature
+-- components/       # Feature-only UI
+-- constants/        # Feature-only constants
+-- hooks/            # Feature-only hooks
+-- schemas/          # Zod validation schemas
+-- services/         # Business use-cases and orchestration
+-- store/            # Zustand store for this feature
+-- types/            # Feature-only TypeScript types
+-- index.ts          # Public exports for the module
```

## Reusable UI vs Feature UI

Place a button, input, modal, table primitive, tooltip, or select in `src/shared/components/ui`
when it is generic and reusable across features.

Place `LoginForm`, `UserManagementTable`, `ProfileDetails`, or `SettingsPanel` inside the owning
feature because they contain feature language, data requirements, or business behavior.

## Forms and Validation

Use React Hook Form for form state and Zod for validation schemas. Keep schemas in the feature that
owns the form, for example `src/features/auth/schemas/login.schema.ts`, and infer form value types
from the schema.

## API Layer

Use `src/shared/services/http/fetch-client.ts` or `src/shared/services/http/axios-client.ts` for
transport concerns. Feature API files, such as `src/features/auth/api/auth.api.ts`, should expose
small typed functions and avoid UI concerns.

## State Management

This scaffold uses Zustand. Keep local feature stores in `src/features/<feature>/store`. Promote
state to a shared store only when multiple features need the same state and ownership is clear.

## Environment Variables

Use `.env.example` as the contract. Public variables must start with `NEXT_PUBLIC_`; server-only
variables must not. Validate variables in `src/shared/config/env.ts` so misconfiguration fails
early.

## Error and Loading Strategy

Use route-level `loading.tsx` for streaming and suspense boundaries. Use `error.tsx` for recoverable
route errors and `global-error.tsx` for root failures. Use reusable feedback components from
`src/shared/components/feedback`.

## Tooling

- ESLint enforces Next.js and TypeScript rules.
- Prettier formats source and Tailwind classes.
- Husky runs `lint-staged` before commits.
- Vitest covers unit and component tests.
- Playwright covers browser workflows.

## Best Practices

- Keep pages thin and compose feature components.
- Do not import one feature's internals from another feature. Export only stable contracts from
  `index.ts`.
- Prefer server components by default. Add `"use client"` only for interactivity, browser APIs,
  or client-side state.
- Keep data fetching close to the route or feature that owns the data.
- Keep side effects in services, not components.
- Treat Zod schemas as runtime boundaries for forms, environment variables, and external responses.
- Use absolute imports through `@/*` to avoid fragile relative paths.
- Add tests around shared utilities, feature services, and critical user flows.
- Keep dependencies centralized and boring. Add new libraries only when they remove meaningful
  complexity.
