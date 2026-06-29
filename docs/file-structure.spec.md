---
title: Project File Structure Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [architecture, structure, conventions]
---

# Introduction

This specification defines the canonical file and folder structure of the `recipe-organizer` repository. It is intended for agents and contributors who need to know where a given file belongs without reading every existing file. Following the rules below keeps the codebase navigable, search-friendly, and consistent with the build/lint toolchain.

## 1. Purpose & Scope

- **Audience**: contributors and AI agents authoring or moving files in this repository.
- **Scope**: the entire repository tree, with normative rules for `src/`, `docs/`, `migrations/`, `scripts/`, `public/`, and root-level config.
- **Out of scope**: implementation details inside files (covered by infrastructure and feature specs).
- **Assumption**: project tooling is Vite+ (`vp`) on top of pnpm, oxlint, oxfmt, Vitest, and Wrangler — see `AGENTS.md`/`CLAUDE.md`.

## 2. Definitions

| Term                          | Definition                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature module**            | A self-contained slice under `src/features/<name>/` exposing API, components, hooks, types, and utils for one bounded domain (auth, recipe, ingredients, shopping-list, users). |
| **Provider / infrastructure** | Cross-cutting machinery used by every feature (data layer, server-function helpers, forms, client state, routing/SSR, platform). Lives outside `features/`.                     |
| **Server function**           | A `createServerFn(...)` exported from `src/features/<name>/api/<verb>.ts`.                                                                                                      |
| **Route file**                | A file under `src/routes/**` that uses `createFileRoute(...)` and is registered in the generated `src/routeTree.gen.ts`.                                                        |
| **Spec file**                 | A `*.spec.md` file describing requirements for a folder, feature, or infra layer. Specs are authoritative documentation.                                                        |
| **kebab-case**                | Lowercase ASCII words separated by `-`. The default casing for filenames in this repo (oxlint enforces `filename-case: kebabCase`).                                             |
| **PascalCase route param**    | TanStack Router file convention `[$id].tsx` for dynamic params; oxlint allows `\\[.+\\]\\.tsx` to bypass kebab-case.                                                            |

## 3. Requirements, Constraints & Guidelines

### Functional requirements

- **REQ-001**: Every file under `src/**` MUST be either a feature file (`src/features/<name>/...`), a route file (`src/routes/...`), or a shared infrastructure file (`src/components`, `src/hooks`, `src/lib`, `src/stores`, `src/styles`, `src/types`, `src/utils`).
- **REQ-002**: Each feature folder MUST expose at most these subfolders, and only those that contain code: `api/`, `components/`, `hooks/`, `contexts/`, `types/`, `utils/`, `lib/`, `spec/`.
- **REQ-003**: Server functions MUST live under `src/features/<name>/api/` with one server function per file, named after the verb: `create.ts`, `update.ts`, `delete.ts`, `get-all.ts`, `get-one.ts`, `get-instructions.ts`, etc.
- **REQ-004**: Drizzle schema modules MUST live in `src/lib/db/schema/<table>.ts` and be re-exported from `src/lib/db/schema/index.ts`. Relations MUST be defined in `src/lib/db/index.ts` via `defineRelations`.
- **REQ-005**: Route files MUST be placed under `src/routes/` and reflect the URL hierarchy. Dynamic segments use `$param.tsx`; nested API routes use `src/routes/api/...`.
- **REQ-006**: Reusable UI primitives (Base UI / Shadcn-flavored) MUST live in `src/components/ui/`; reusable form fields in `src/components/forms/`; reusable dialogs in `src/components/dialogs/`; reusable layout in `src/components/layout/`; reusable navigation in `src/components/navigation/`; reusable error UI in `src/components/error/`; reusable icons in `src/components/icons/`.
- **REQ-007**: Cross-feature singleton client state MUST live in `src/stores/<topic>.store.ts` (TanStack Store via the shared `persistedStore` helper). Feature-internal stores MUST stay inside the feature folder.
- **REQ-008**: Pure helper utilities (no React, no DOM, no fetch) MUST live in `src/utils/`. Anything that depends on React, the database, or Cloudflare bindings belongs in `src/lib/` or feature folders.
- **REQ-009**: Database migrations MUST live under `migrations/` (drizzle-kit `out`). The `migrations_tmp/` directory referenced in `wrangler.jsonc` is owned by Wrangler and MUST NOT be hand-edited.
- **REQ-010**: Specs MUST follow the naming and location rules in §3 _Spec rules_.

### Spec rules

- **REQ-011**: Cross-cutting infrastructure specs MUST live under `docs/infrastructure/<topic>.spec.md`.
- **REQ-012**: Project-wide architecture and structure specs MUST live under `docs/<topic>.spec.md` (e.g. `docs/architecture.spec.md`, `docs/file-structure.spec.md`).
- **REQ-013**: Per-feature specs MUST live colocated with the feature: either `src/features/<name>/<name>.spec.md` (single-file) or `src/features/<name>/spec/index.spec.md` plus optional sub-spec files (e.g. `crud.spec.md`, `display.spec.md`, `editor.spec.md`).
- **REQ-014**: Every spec MUST start with the front-matter block defined in §4 and contain all eleven sections. Specs MUST be self-contained and unambiguous.

### Naming constraints

- **CON-001**: All filenames except dynamic-route brackets MUST be kebab-case (`oxlint:filename-case = kebabCase`).
- **CON-002**: TypeScript files use `.ts` for non-React modules and `.tsx` only for files that contain JSX.
- **CON-003**: Spec files MUST use the suffix `.spec.md`.
- **CON-004**: The generated route tree `src/routeTree.gen.ts` MUST NOT be hand-edited. It is regenerated by TanStack Router on dev/build (CLAUDE.md: restart `pnpm dev` after route changes).
- **CON-005**: Worker-only globals (`cloudflare:workers`, `crypto.randomUUID`, `env.*`) MUST appear only in files that run on the server (server functions, route handlers, SSR loaders). Importing such a module from a client-only component breaks the build.
- **CON-006**: Persisted store files (TanStack Store) and their consumers are plain modules — no
  `'@tanstack/react-start/client-only'` directive and no `<ClientOnly>` wrapper. The app runs in
  client-only render mode (`src/start.ts` sets `defaultSsr: false`, root opts into `ssr: true`), so
  store-backed content never renders during SSR. See `docs/infrastructure/routing-ssr.spec.md`.
- **CON-007**: Path aliases use `@/` (mapped via `tsconfig.json` and Vite). Imports SHOULD use `@/...` instead of long relative paths, except when the file is in the same directory.

### Guidelines

- **GUD-001**: Group files by _feature first, layer second_. Adding a new screen for an existing feature does not require new top-level folders.
- **GUD-002**: Prefer one exported entity per file. Server functions and Zod schemas often live in the same file when they share the validator.
- **GUD-003**: When a feature grows beyond ~10 files, split it into subdirectories (`components/editor/...`) rather than flattening.
- **GUD-004**: Don't duplicate types between features — promote them to `src/types/<topic>.ts` only when ≥2 features import them.
- **GUD-005**: Specs are documentation, not source of truth for data — reference code paths instead of inlining large code dumps.

### Patterns

- **PAT-001**: API file pattern — each `src/features/<name>/api/<verb>.ts` exports both the server function and a TanStack Query `*Options()` factory. The factory is the canonical client entry point.
- **PAT-002**: Form pattern — `src/features/<name>/components/<entity>-form.tsx` exports a `withForm(...)` view; `add-<entity>.tsx` and `edit-<entity>.tsx` wrap it in `getFormDialog(...)`.
- **PAT-003**: Editor extensions pattern — Lexical custom nodes live under `src/features/recipe/components/editor/<extension>/<extension>-{button,dialog,node}.tsx` and are registered through `extensions.ts`.
- **PAT-004**: Stores pattern — `src/stores/<name>.store.ts` exports a data-only store instance (via the `persistedStore` helper), a `useSelector`-based read hook, and plain action functions. State is normalized (ids only) — never duplicate server-fetched objects.

## 4. Interfaces & Data Contracts

### Repository tree (canonical)

```
recipe-organizer/
├── .github/                  CI workflows
├── .renovate/                Renovate config
├── .tanstack/                TanStack devtools state (gitignored)
├── .vite-hooks/              Vite+ hooks state (gitignored)
├── .wrangler/                Wrangler local state (gitignored)
├── .zed/                     Editor settings (optional)
├── docs/
│   ├── architecture.spec.md          Global architecture
│   ├── file-structure.spec.md        This file
│   └── infrastructure/
│       ├── client-state.spec.md
│       ├── data-layer.spec.md
│       ├── forms.spec.md
│       ├── platform.spec.md
│       ├── routing-ssr.spec.md
│       └── server-functions.spec.md
├── migrations/               drizzle-kit migrations (canonical)
├── migrations_tmp/           wrangler-managed (do NOT edit)
├── public/                   Static assets served from /
├── scripts/
│   ├── apply-migration-local.ts      `pnpm db:migrate:local`
│   └── generate-sw.ts                Service worker plugin
├── src/
│   ├── components/
│   │   ├── dialogs/          Reusable dialog wrappers
│   │   ├── error/            Error/Not-found/offline banners
│   │   ├── forms/            Form field components
│   │   ├── icons/            Custom SVG/icon components
│   │   ├── layout/           Screen layout wrappers
│   │   ├── navigation/       Tabbar, navbar, navigation constants
│   │   ├── ui/               Base UI primitives (button, dialog, etc.)
│   │   └── search-input.tsx  Cross-cutting components live at root
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── lib/          Auth-only middleware (auth-guard.ts)
│   │   │   └── auth.spec.md
│   │   ├── ingredients/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── ingredients.spec.md
│   │   ├── recipe/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   │   └── editor/   Lexical extensions (magimix, subrecipe)
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── spec/
│   │   │   │   ├── crud.spec.md
│   │   │   │   ├── display.spec.md
│   │   │   │   ├── editor.spec.md
│   │   │   │   └── index.spec.md
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── shopping-list/
│   │   │   ├── api/
│   │   │   ├── component/    (existing typo-tolerant)
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── shopping-list.spec.md
│   │   └── users/
│   │       ├── api/
│   │       ├── components/
│   │       └── users.spec.md
│   ├── hooks/                Shared hooks (use-app-form, use-file-upload, ...)
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts      defineRelations + getDb()
│   │   │   └── schema/       Drizzle table modules (one per table)
│   │   ├── cache-manager.ts  Cloudflare edge cache wrapper
│   │   ├── query-keys.ts     TanStack Query key factory
│   │   ├── r2.ts             R2 upload/delete helpers + Cloudflare Images
│   │   ├── theme.ts          Theme cookie helpers
│   │   └── toast-helpers.ts  Toast convenience wrappers
│   ├── routes/
│   │   ├── __root.tsx        Root route (SSR shell)
│   │   ├── index.tsx         /
│   │   ├── search.tsx        /search
│   │   ├── shopping-list.tsx /shopping-list
│   │   ├── settings.tsx      /settings (auth gate)
│   │   ├── settings/
│   │   │   ├── account.tsx
│   │   │   ├── index.tsx     /settings (entry list)
│   │   │   ├── ingredients.tsx
│   │   │   └── users.tsx
│   │   ├── auth/login.tsx
│   │   ├── recipe/
│   │   │   ├── $id.tsx
│   │   │   ├── edit.$id.tsx
│   │   │   └── new.tsx
│   │   └── api/
│   │       ├── auth/$.ts        Better Auth catch-all (getAuth().handler)
│   │       ├── image/$id.ts
│   │       └── video/$id.ts
│   ├── stores/               Persistent TanStack Store stores
│   ├── styles/               Global Tailwind entry (app.css)
│   ├── types/                Cross-feature type aliases (drizzle infer)
│   ├── utils/                Pure helpers (cn, array, number, ...)
│   ├── routeTree.gen.ts      AUTOGENERATED — do not edit
│   ├── router.tsx            getRouter() factory
│   └── sw.ts                 Service worker entry (Serwist)
├── AGENTS.md                 Project instructions for agents (CLAUDE.md is a symlink)
├── CLAUDE.md -> AGENTS.md
├── README.md
├── components.json           Shadcn registry config
├── database.sql              Latest D1 dump (gitignored in production)
├── drizzle.config.ts         drizzle-kit config (D1 HTTP)
├── knip.json                 Unused-code detector
├── package.json              Vite+ project (pnpm@10.33.0)
├── pnpm-lock.yaml
├── renovate.json5
├── tsconfig.json
├── vite.config.ts            All tooling config (lint/fmt/plugins)
├── worker-configuration.d.ts AUTOGENERATED by `wrangler types`
└── wrangler.jsonc            Worker bindings (DB, R2_BUCKET, IMAGES)
```

### Spec front matter schema

Every `*.spec.md` file MUST start with the following YAML front matter:

```yaml
---
title: <Concise spec title>
version: <semantic version, e.g. 1.0>
date_created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
owner: <team-or-individual>
tags: [<one>, <or>, <more>]
---
```

### Section schema

Every spec MUST contain sections numbered 1–11 with these exact headings:

1. Purpose & Scope
2. Definitions
3. Requirements, Constraints & Guidelines
4. Interfaces & Data Contracts
5. Acceptance Criteria
6. Test Automation Strategy
7. Rationale & Context
8. Dependencies & External Integrations
9. Examples & Edge Cases
10. Validation Criteria
11. Related Specifications / Further Reading

### Identifier prefixes

| Prefix                                    | Use                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `REQ-`                                    | Functional requirement                                                          |
| `SEC-`                                    | Security requirement                                                            |
| `CON-`                                    | Constraint                                                                      |
| `GUD-`                                    | Guideline                                                                       |
| `PAT-`                                    | Pattern to follow                                                               |
| `AC-`                                     | Acceptance criterion                                                            |
| `EXT-`/`SVC-`/`INF-`/`DAT-`/`PLT-`/`COM-` | External system / third-party / infra / data / platform / compliance dependency |
| `VAL-`                                    | Validation criterion                                                            |

## 5. Acceptance Criteria

- **AC-001**: Given a new feature `foo`, When the author creates `src/features/foo/api/get-all.ts`, Then it MUST export both the server function and a `getFooListOptions()` factory.
- **AC-002**: Given a request to add a `bar` Drizzle table, When the schema is added at `src/lib/db/schema/bar.ts`, Then it MUST be re-exported from `src/lib/db/schema/index.ts` and registered in `defineRelations` if it has FKs.
- **AC-003**: Given a route file `src/routes/foo/$id.tsx`, When the dev server is restarted, Then `src/routeTree.gen.ts` MUST contain the new route entry without manual edits.
- **AC-004**: Given a TanStack Store, When the file is added under `src/stores/`, Then it is a plain
  module (no `'@tanstack/react-start/client-only'` directive); consumers render it within client-only
  routes without a `<ClientOnly>` wrapper.
- **AC-005**: Given a new spec, When it is written, Then it MUST live at one of: `docs/<topic>.spec.md`, `docs/infrastructure/<topic>.spec.md`, `src/features/<name>/<name>.spec.md`, or `src/features/<name>/spec/<topic>.spec.md`, and MUST contain the full eleven-section template.
- **AC-006**: Given any new file under `src/`, When `vp lint` runs, Then `filename-case: kebabCase` MUST pass (TanStack `[$id].tsx` files are exempt).
- **AC-007**: Given a feature spec, When read by an agent, Then it SHALL not require reading the source code to understand requirements (specs are self-contained).

## 6. Test Automation Strategy

- **Test Levels**: Linting (oxlint via `vp lint`), formatting (oxfmt via `vp fmt`), type checking (`vp check`), unit/integration tests (Vitest via `vp test`).
- **Frameworks**: Vite+ wraps Oxlint, Oxfmt, Vitest. Test utilities import from `vite-plus/test`, never `vitest`.
- **Test data management**: D1 local snapshot via `pnpm db:dump` / `pnpm db:import`; tests SHOULD use ephemeral fixtures.
- **CI/CD integration**: GitHub Actions runs `vp install`, `vp check`, `vp test` (see CLAUDE.md). Migrations applied during deployment (`pnpm db:migrate:remote`).
- **Coverage requirements**: not enforced; smoke-test critical flows.
- **Performance testing**: not in scope.

## 7. Rationale & Context

- **Feature-first organization** keeps the blast radius of a change small. A new feature lives in one folder and registers with the rest via TanStack Router routes and TanStack Query keys.
- **Generated route tree** (`routeTree.gen.ts`) eliminates manual route registration but requires restarts on file additions/moves.
- **Infrastructure under `src/lib/`** vs **utilities under `src/utils/`**: the split is "depends on a binding/SDK" vs "pure". This keeps `utils/` tree-shakeable and easy to test in isolation.
- **Specs colocated with features** are easier to keep in sync with code than centralized docs. Cross-cutting specs stay in `docs/` because they describe shared infrastructure.
- **kebab-case** is enforced by oxlint and matches URL conventions; PascalCase route brackets are an exception driven by TanStack Router's filename-as-param scheme.
- **Avoid hand-edits to generated artifacts**: `routeTree.gen.ts`, `worker-configuration.d.ts`, and the contents of `migrations_tmp/` are produced by tools and overwritten on rebuild.

## 8. Dependencies & External Integrations

### Technology Platform Dependencies

- **PLT-001**: pnpm 10.33.0 (declared via `packageManager`).
- **PLT-002**: Vite+ (`vite-plus`) 0.1.18 — wraps Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt.
- **PLT-003**: TypeScript 6.0.3.
- **PLT-004**: Wrangler 4.x for Cloudflare Workers tooling.

### Infrastructure Dependencies

- **INF-001**: GitHub Actions for CI (with `voidzero-dev/setup-vp@v1`).
- **INF-002**: Cloudflare Workers + D1 + R2 + Images bindings (see `wrangler.jsonc`).

## 9. Examples & Edge Cases

### Example: adding a new entity `mealPlan`

1. Schema → `src/lib/db/schema/meal-plan.ts`; re-export from `schema/index.ts`; register in `defineRelations`.
2. Migration → `vp dlx drizzle-kit generate` (creates a file in `migrations/`).
3. API → `src/features/meal-plan/api/{get-all,create,update,delete}.ts`.
4. Components → `src/features/meal-plan/components/{meal-plan-form,add-meal-plan,...}.tsx`.
5. Route → `src/routes/meal-plan/index.tsx`. Restart `pnpm dev`.
6. Spec → `src/features/meal-plan/meal-plan.spec.md` (single-file) following the section schema.

### Edge: dynamic route brackets

`src/routes/recipe/$id.tsx` and `src/routes/recipe/edit.$id.tsx` use `$id` as a param. The `oxlint:filename-case` rule allows the bracket form via the regex `\\[.+\\]\\.tsx` — this exception applies even to non-bracket TanStack patterns thanks to that ignore rule.

### Edge: generated files

`routeTree.gen.ts` and `worker-configuration.d.ts` are excluded from `vp lint`/`vp fmt` (see `vite.config.ts` ignore lists). Don't open them in editors with format-on-save.

## 10. Validation Criteria

- **VAL-001**: `vp check` passes (format + lint + type-check).
- **VAL-002**: Every spec parses with the front-matter schema in §4.
- **VAL-003**: There is no file under `src/features/` outside the allowed subfolders listed in REQ-002.
- **VAL-004**: There is no `*.spec.md` file outside `docs/`, `docs/infrastructure/`, or `src/features/<name>/(spec/)?`.
- **VAL-005**: `routeTree.gen.ts` is identical to the file produced by a fresh `vp build`.

## 11. Related Specifications / Further Reading

- [Architecture](./architecture.spec.md)
- [Platform (Cloudflare Workers)](./infrastructure/platform.spec.md)
- [Data Layer (Drizzle + D1)](./infrastructure/data-layer.spec.md)
- [Server Functions](./infrastructure/server-functions.spec.md)
- [Routing & SSR](./infrastructure/routing-ssr.spec.md)
- [Forms](./infrastructure/forms.spec.md)
- [Client State Layering](./infrastructure/client-state.spec.md)
- TanStack Start docs: <https://tanstack.com/start>
- TanStack Router file-based routing: <https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing>
- Cloudflare Workers + D1 docs: <https://developers.cloudflare.com/workers/>, <https://developers.cloudflare.com/d1/>
