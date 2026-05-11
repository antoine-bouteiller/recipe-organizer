# Cloudflare → Void Migration — Index

This folder is the canonical reference for migrating `recipe-organizer` from
**TanStack Start on Cloudflare Workers (via `@cloudflare/vite-plugin`)**
to **Void in Pages mode** (`voidPlugin()` + `@void/react`), still deployed
to the project owner's own Cloudflare account via `wrangler deploy` (D5/D8 —
Cloudflare Images binding retained, Void Cloud not used).

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
- **Deploy** — stays on `wrangler deploy` (D8). Build pipeline shifts
  from `@cloudflare/vite-plugin` → `voidPlugin()` (Void merges inferred
  bindings with `wrangler.jsonc` at build time).

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

| Topic       | Decision                                                                           |
| ----------- | ---------------------------------------------------------------------------------- |
| Routing/SSR | **Full Void Pages mode** — drop TanStack Router + Start entirely                   |
| Auth        | **`void/auth`** (Better Auth) with Google provider                                 |
| Query       | **Full removal** — loaders + `useForm` + `action()` cover everything (D19)         |
| Form        | Use `useForm` from `@void/react`; rebuild form **components** locally              |
| Validators  | **Valibot** project-wide (already migrated); `void/drizzle-valibot` for DB-derived |
| Images      | **Keep Cloudflare Images** via `wrangler.jsonc`                                    |
| Deploy      | **`wrangler deploy`** to own Cloudflare account (not Void Cloud)                   |
| Success UX  | **No success toasts** — redirect/loader-refresh is the feedback (D18)              |

## Spec files

| #   | File                                                              | Purpose                                                                                |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 00  | [decisions.spec.md](./00-decisions.spec.md)                       | Architectural decisions log with rationale                                             |
| 01  | [toolchain-and-config.spec.md](./01-toolchain-and-config.spec.md) | `package.json`, `vite.config.ts`, `void.json`, `tsconfig.json`, `env.ts`, `.gitignore` |
| 02  | [data-layer.spec.md](./02-data-layer.spec.md)                     | `db/schema.ts`, migrations, `void/db`, relations, `@schema` alias                      |
| 03  | [bindings.spec.md](./03-bindings.spec.md)                         | R2 → `void/storage`, Cloudflare Images retention, env-binding renames                  |
| 04  | [auth.spec.md](./04-auth.spec.md)                                 | Better Auth wiring, schema mapping, data migration from existing users                 |
| 05  | [routing-and-pages.spec.md](./05-routing-and-pages.spec.md)       | TanStack Router → Pages mode, per-route mapping, middleware, layouts                   |
| 06  | [forms.spec.md](./06-forms.spec.md)                               | TanStack Form removal, `useForm` patterns, component rebuild                           |
| 07  | [tanstack-query.spec.md](./07-tanstack-query.spec.md)             | Per-call-site removal plan and contingencies                                           |
| 08  | [deployment-and-ops.spec.md](./08-deployment-and-ops.spec.md)     | `wrangler deploy`, Cloudflare secrets, CI, `wrangler tail`, migrations on remote       |
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
  without console errors, and persists/loads via real D1 + R2 + IMAGES
- `wrangler deploy` to a preview Cloudflare Worker succeeds, with:
  - auth migrations applied (via `wrangler d1 migrations apply DB --remote`)
  - Better Auth Google flow working end-to-end
  - recipe image uploads surviving a round-trip through `env.IMAGES` + R2
- `@cloudflare/vite-plugin`, `@tanstack/react-router`,
  `@tanstack/react-start`, `@tanstack/react-router-ssr-query`, and (if
  removed) `@tanstack/react-query` no longer appear in `package.json`
- `wrangler` and `wrangler.jsonc` stay (D5 / D8) — they're the deploy
  surface, not deletable artefacts
- No imports remain from `@tanstack/react-router`, `@tanstack/react-start`,
  or `@tanstack/react-form` in `src/`
- `cloudflare:workers` env imports are removed from app code except
  where `c.env.IMAGES` is read in the recipe-create action (Void's `c.env`
  exposes the binding via the merged Cloudflare config — confirm the
  cleanest access pattern at implementation)

## Open decisions still blocking implementation

None. All architectural decisions are resolved in
[00-decisions.spec.md](./00-decisions.spec.md) (D1–D19). The remaining
work is implementation per the per-phase specs and `10-migration-plan`.

Implementation-time verifications (not blocking the spec, but to be
confirmed during the relevant phase):

- `db.query.*` relational queries auto-injected by Void's Vite plugin
  ([02-data-layer](./02-data-layer.spec.md))
- `wrangler d1 migrations apply` accepts Void's flat
  `db/migrations/<ts>_<name>.sql` shape
  ([02-data-layer](./02-data-layer.spec.md#migrations-directory))
- `useForm` `errors` keys can address nested-array paths like
  `ingredientGroups.0.name`
  ([06-forms](./06-forms.spec.md#recipe-form--ingredient-groups))
- Better Auth's generated `account` schema matches the column set
  assumed by [`scripts/02_backfill_users_from_legacy.sql`](./scripts/02_backfill_users_from_legacy.sql)
