# Cloudflare → Void Migration — Index

This folder is the canonical reference for migrating `recipe-organizer` from
**TanStack Start on Cloudflare Workers (via `@cloudflare/vite-plugin` + Wrangler)**
to **Void in Pages mode** (`voidPlugin()` + `@void/react` + `void deploy`).

## Scope (in)

Everything Void natively supports gets migrated:

- **Toolchain** — `@cloudflare/vite-plugin` → `voidPlugin() + voidReact()`
- **Database** — Drizzle on D1 via `cloudflare:workers` env → `void/db` + `void/schema-d1`
- **Cloudflare services** — `R2_BUCKET` → `void/storage`; D1 → `void/db`;
  Cloudflare `IMAGES` → see [03-bindings.spec.md](./03-bindings.spec.md)
  (open decision)
- **Auth** — hand-rolled Google OAuth + TanStack `useSession` → `void/auth`
  (Better Auth), Google provider via `auth.providers`
- **Routing & SSR** — TanStack Router + Start server functions →
  Void Pages mode (`pages/` + `.server.ts` loaders/actions) and Void API
  routes (`routes/` for non-page HTTP endpoints)
- **Forms** — `@tanstack/react-form` → `useForm` from `@void/react`
- **Env** — `cloudflare:workers` + `import.meta.env.VITE_*` → `void/env` typed
  schema (`env.ts`)
- **Deploy** — `wrangler deploy` → `void deploy` (Void Cloud)

## Scope (out / conditional)

- **TanStack Query** — remove **if** loader-driven data fetching makes it
  redundant; see [07-tanstack-query.spec.md](./07-tanstack-query.spec.md) for
  the kill list per call site.
- **Lexical editor, Vidstack, motion, Phosphor, Zustand stores, Shadcn UI** —
  not touched by this migration. They are pure client libraries and continue
  to work under Pages mode unchanged.
- **PWA (Serwist)** — keep. The custom Vite plugin keeps working; see
  [09-misc-cleanup.spec.md](./09-misc-cleanup.spec.md).
- **Vite+ (`vp`)** — keep. `void` and Vite+ compose at the Vite layer.

## Decisions locked in (see [00-decisions.spec.md](./00-decisions.spec.md))

| Topic       | Decision                                                              |
| ----------- | --------------------------------------------------------------------- |
| Routing/SSR | **Full Void Pages mode** — drop TanStack Router + Start entirely      |
| Auth        | **`void/auth`** (Better Auth) with Google provider                    |
| Query       | Remove **if** natural (loaders cover usage)                           |
| Form        | Use `useForm` from `@void/react`; rebuild form **components** locally |
| Images      | **Investigate first** — open question, see 03-bindings                |

## Spec files

| #   | File                                                              | Purpose                                                                                |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 00  | [decisions.spec.md](./00-decisions.spec.md)                       | Architectural decisions log with rationale                                             |
| 01  | [toolchain-and-config.spec.md](./01-toolchain-and-config.spec.md) | `package.json`, `vite.config.ts`, `void.json`, `tsconfig.json`, `env.ts`, `.gitignore` |
| 02  | [data-layer.spec.md](./02-data-layer.spec.md)                     | `db/schema.ts`, migrations, `void/db`, relations, `@schema` alias                      |
| 03  | [bindings.spec.md](./03-bindings.spec.md)                         | R2 → `void/storage`, IMAGES open question, env-binding renames                         |
| 04  | [auth.spec.md](./04-auth.spec.md)                                 | Better Auth wiring, schema mapping, data migration from existing users                 |
| 05  | [routing-and-pages.spec.md](./05-routing-and-pages.spec.md)       | TanStack Router → Pages mode, per-route mapping, middleware, layouts                   |
| 06  | [forms.spec.md](./06-forms.spec.md)                               | TanStack Form removal, `useForm` patterns, component rebuild                           |
| 07  | [tanstack-query.spec.md](./07-tanstack-query.spec.md)             | Per-call-site removal plan and contingencies                                           |
| 08  | [deployment-and-ops.spec.md](./08-deployment-and-ops.spec.md)     | `void deploy`, secrets, CI, logs, migrations on remote                                 |
| 09  | [misc-cleanup.spec.md](./09-misc-cleanup.spec.md)                 | PWA, devtools, sw.ts, `routeTree.gen.ts`, residual files                               |
| 10  | [migration-plan.spec.md](./10-migration-plan.spec.md)             | Phase ordering, branch strategy, verification gates, rollback                          |

## Reading order

1. [00-decisions](./00-decisions.spec.md) — understand the why
2. [10-migration-plan](./10-migration-plan.spec.md) — see the order of
   operations and gates
3. Then 01 → 09 as the work progresses

## Success criteria

A migration is "done" when **all** of the following hold on the target branch:

- `vp check` (lint + types + fmt) passes
- `vp test` passes
- `vp dev` boots, exercises every route under
  [05-routing-and-pages.spec.md → Route inventory](./05-routing-and-pages.spec.md#route-inventory)
  without console errors, and persists/loads via real D1 + R2
- `void deploy` to a preview project succeeds, with auth migrations applied,
  Better Auth Google flow working end-to-end, and recipe image uploads
  surviving a round-trip
- `wrangler.jsonc`, `@cloudflare/vite-plugin`, `@tanstack/react-router`,
  `@tanstack/react-start`, `@tanstack/react-router-ssr-query`, and (if
  removed) `@tanstack/react-query` no longer appear in `package.json`
- No imports remain from `@tanstack/react-router`, `@tanstack/react-start`,
  `cloudflare:workers`, or `@tanstack/react-form` in `src/` (except inside
  `void-migration/` references)

## Open decisions still blocking implementation

These must be resolved **before** the corresponding spec section can be acted on:

1. **Cloudflare Images binding** ([03-bindings](./03-bindings.spec.md#open-question-cloudflare-images)).
   Options: (a) drop Images and resize client-side before R2 upload, (b) keep
   Images binding via custom `wrangler.jsonc` and **deploy to own Cloudflare
   account** (not Void Cloud), (c) move transform to Workers AI / R2-side
   resize service.
2. **Existing user data migration** ([04-auth](./04-auth.spec.md#existing-user-data-migration)).
   Better Auth uses its own `user`/`account`/`session`/`verification` tables.
   Decide whether to (a) backfill existing users into Better Auth tables and
   keep `role` + `status` columns via a Better Auth user extension, or
   (b) wipe and re-onboard (acceptable only if user data is non-precious).
3. **TanStack Query removal — full or partial** ([07-tanstack-query](./07-tanstack-query.spec.md#decision-point)).
   Some mutations (`recipe create/update/delete`, user approve/block) currently
   use Query's mutation/invalidation flow with toasts. Pages-mode actions
   re-run the loader automatically; toast-on-mutation needs a small replacement.
