# 00 — Architectural Decisions

Locked-in choices for the migration. Each row records the alternative
considered and the reason for the pick, so reviewers can challenge specific
trade-offs without re-deriving the whole tree.

## D1 — Routing & SSR

**Decision: Full Void Pages mode.** Replace TanStack Router + TanStack Start
with `@void/react` Pages mode (`pages/` + `.server.ts` loaders/actions).

| Alternative                               | Why rejected                                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep TanStack Start, swap CF for Void     | Void-managed auth is **not supported** in framework mode (per `node_modules/void/skills/void/docs/integrations/frameworks/tanstack-start.md` and `guide/auth.md`). Would block decision D2. |
| Hybrid: TanStack UI + Void `routes/` only | Two routing systems and two SSR runtimes coexisting. Increases surface, defeats the "delete TanStack" goal, and still blocks `void/auth`.                                                   |

**Consequences:**

- All `src/routes/*.tsx` move to `pages/` with `.server.ts` companions.
- `src/router.tsx`, `src/routeTree.gen.ts`, `__root.tsx`, and `createFileRoute`
  go away. Replaced by `pages/layout.tsx` + the framework adapter's auto-generated entries.
- `createServerFn` and `createServerOnlyFn` go away. Replaced by `loader` /
  `action` exports in `.server.ts` and `routes/` for non-page HTTP endpoints.
- Navigation primitives change: `Link` from `@tanstack/react-router` →
  `Link` from `@void/react`. `useNavigate`/`useRouter` analogues from
  `@void/react`. `useRouteContext` → `useShared()` (middleware-set) or
  page props (loader-set).

## D2 — Authentication

**Decision: `void/auth` (Better Auth) with Google provider.** Delete the
custom `src/features/auth/api/google-auth.ts` flow, custom `useAppSession` /
`useOAuthSession`, and `SESSION_SECRET`.

| Alternative                            | Why rejected                                                                                                                                                                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep custom OAuth, swap session store  | Preserves UX but keeps ~150 lines of hand-rolled OAuth state, callback, error mapping, and session cookie config. `void/auth` covers all of that, plus provides the typed helpers (`requireAuth`, `getUser`) that Pages loaders are designed around. |
| Keep everything, swap only env imports | Defeats the migration goal — TanStack Start `useSession` and the OAuth callback route would have to keep living somewhere, and that "somewhere" is exactly what we're removing.                                                                      |

**Consequences:**

- `auth.providers: ["google"]` in `void.json` (no email/password — the app is
  invite-only Google sign-in today). See [04-auth](./04-auth.spec.md).
- `BETTER_AUTH_SECRET` replaces `SESSION_SECRET`.
- `AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` replace
  `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
- Mount path moves from `/api/auth/google` (custom) to `/api/auth/*` (Better
  Auth). Frontend hand-off URLs change.
- **Approval gate (`user.status` = pending/blocked/active) and admin role
  must be preserved** via a Better Auth user extension or a sibling `user_profile`
  table — see [04-auth](./04-auth.spec.md#preserving-status-and-role).

## D3 — TanStack Query

**Decision: Remove `@tanstack/react-query` if the post-migration usage
collapses naturally.** Keep it only if a non-trivial site still benefits
(e.g. a screen with optimistic state Pages-mode loaders can't model cleanly).

| Alternative                  | Why considered                | Outcome                                                                                                                                                      |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keep Query unconditionally   | Lower migration risk, same UX | Wasteful: every query gets replaced by a loader, every mutation by an action that auto-reruns loader. Toast notifications can live in an `action()` wrapper. |
| Remove Query unconditionally | Maximum simplification        | Acceptable as long as toast-on-mutation and invalidation patterns find equivalents (see [07-tanstack-query](./07-tanstack-query.spec.md)).                   |

**Resolution:** Plan removal as the default. If during implementation a
specific call-site shows that Pages-mode primitives cannot replicate the
required behavior **and** the cost of keeping Query for just that site is
lower than working around it, scope the leftover. Document any retained usage
in [07-tanstack-query.spec.md → Retained usage](./07-tanstack-query.spec.md#retained-usage).

## D4 — TanStack Form

**Decision: Adopt `useForm` from `@void/react`. Rebuild the form
**components** (inputs, field wrappers, error displays) locally; do **not\*\*
keep `@tanstack/react-form`.

| Alternative                            | Why rejected                                                                                                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keep TanStack Form alongside `useForm` | Two form systems is worse than one. Void's `useForm` is wired end-to-end with action validators, errors, and Inertia page updates — keeping TanStack Form would mean serializing back into `useForm.post(...)` for every submit anyway. |
| Use raw `<form action={form.post}>`    | Fine for simple forms. For the recipe editor — ingredient-group field, quantity controls, file uploads, linked recipes — we still need composed input components. Those components were TanStack-Form-specific and need rebuilding.     |

**Consequences:**

- All current `useAppForm`, `useFormContext`, `form.ts`, and `format-form-errors.ts`
  helpers go away.
- The composed components in `src/components/forms/`, `src/features/recipe/components/recipe-form.tsx`,
  `ingredient-group-field.tsx`, `quantity-controls.tsx`, and `src/features/users/components/user-form.tsx`
  must be rewritten against `useForm` from `@void/react`. See [06-forms](./06-forms.spec.md).

## D5 — Cloudflare Images

**Decision: Keep the Cloudflare Images binding via `wrangler.jsonc`.**
The current image pipeline (`env.IMAGES.input(...).transform(...).output(...)`)
stays intact. Access via `c.env.IMAGES` in the recipe-create action.

| Alternative                                    | Why rejected                                                                                                                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Drop Images, transform client-side             | Adds CPU work to the user's device, especially noticeable on low-end phones during the recipe-create flow. Server-side transform is already working and is the right tool for the job. |
| Drop the transform entirely, store raw uploads | Worse UX (slow loads, heavy R2 egress) and undoes a feature the app already has.                                                                                                       |

**Consequences:**

- **D8 flips to direct `wrangler deploy`.** Void Cloud doesn't expose
  arbitrary Cloudflare bindings beyond the first-class set
  (`DB`/`KV`/`STORAGE`/`AI`/`SANDBOX`/`QUEUE_*`), so `void deploy` cannot
  ship the `IMAGES` binding.
- `wrangler` stays as a devDependency.
- `wrangler.jsonc` stays in the repo with the `images: { binding: "IMAGES" }`
  block plus updated bindings (D1, R2 → `STORAGE`).
- Secrets are managed via `wrangler secret put`, not `void secret put`.
- Migrations on production D1 run via `wrangler d1 migrations apply DB --remote`
  (must validate that wrangler accepts Void's flat
  `db/migrations/<ts>_<name>.sql` shape — see
  [02-data-layer](./02-data-layer.spec.md#migrations-directory)).
- CI uses `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` instead of
  `VOID_TOKEN`.
- Rollback is via redeploying a previous tagged build, not
  `void project rollback`.
- `void` CLI is **still used** for non-deploy concerns: `void prepare`
  (typegen), `void db generate` (Drizzle migration scaffolding),
  `void db studio`, `void env check`, `void env types`.

## D6 — Vite+ toolchain (`vp`)

**Decision: Keep Vite+.** Void is a Vite plugin; Vite+ is a Vite wrapper. They
compose. `vp dev`, `vp build`, `vp check`, `vp test` keep working.

The `pnpm.overrides` pinning `vite` to `@voidzero-dev/vite-plus-core@latest`
stays. The `prepare` script (`vp config`) stays, with `void prepare` added
alongside to generate `.void/*.d.ts` for typechecking.

## D7 — PWA / Serwist

**Decision: Keep.** The `tanstackSerwistPlugin()` in `vite.config.ts` is a
plain Vite plugin and doesn't depend on TanStack Start runtime. Confirm at
implementation time that the generated `sw.ts` still picks up the new build
output paths.

## D8 — Deploy target

**Decision: Direct `wrangler deploy` to the project owner's Cloudflare
account.** Driven by D5 (Cloudflare Images binding kept). Void Cloud is
**not** used.

| Alternative                | Why rejected                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `void deploy` (Void Cloud) | D5 keeps the `IMAGES` binding, which Void Cloud cannot provision. Picking `void deploy` would force dropping Images, which D5 has rejected. |

**Consequences:**

- `wrangler` stays as a devDependency.
- `wrangler.jsonc` stays committed at the repo root with `d1_databases`,
  `r2_buckets`, `images`, and `compatibility_date`.
- Deploy flow: `vite build` → `wrangler deploy`.
- The `vite build` output writes a merged `wrangler.json` under `dist/`
  that includes Void-inferred bindings (D1, R2) plus the bindings declared
  in your `wrangler.jsonc` (Images). `wrangler deploy` picks that up.
- See [08-deployment-and-ops](./08-deployment-and-ops.spec.md) for the
  full flow, secrets, CI, migrations on remote, rollback, and logs.

## D20 — Logging discipline

**Decision: Keep `'no-console': 'error'` and adopt `void/log` `logger.*`
for observability.** Replace any intentional `console.*` call-site with
`import { logger } from 'void/log'; logger.error(...)` / `.warn(...)` /
`.info(...)`.

| Alternative                                                           | Why rejected                                                                                                                       |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Keep `no-console`, allow per-call `// oxlint-disable` for `console.*` | Annotation noise at every observability site; rule erosion over time. `void/log` gives a single import to look for in code review. |
| Drop `no-console` entirely                                            | Any forgotten `console.log` ships to `wrangler tail` and clutters production logs.                                                 |

**Consequences:**

- `'no-console': 'error'` stays in `vite.config.ts` lint rules.
- Server-side intentional logs migrate from `console.*` to
  `logger.error(...)` / `.warn(...)` / `.info(...)` from `void/log`.
- `void/log` writes through `console.*` on the worker side, so logs
  still surface in `wrangler tail` and any Cloudflare log destination.
- Lint-driven sweep: `grep -rn 'console\.' src/` after migration; every
  remaining hit is either deleted or replaced with the logger.

## D19 — TanStack Query removal scope

**Decision: Full removal upfront.** `@tanstack/react-query` and
`@tanstack/react-query-devtools` are removed as part of Phase 5/6. Every
existing `useSuspenseQuery` / `useMutation` gets a Pages-mode replacement
(loader / `useForm` / `action()`). If a specific call-site during
implementation genuinely can't be modeled by Pages-mode primitives,
escalate at that point — but plan as if removal is total.

| Alternative                                | Why rejected                                                                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Keep Query scoped to a few islands         | Adds a partial QueryClientProvider mount and the cognitive overhead of two data-fetching idioms. Not worth it for this codebase. |
| Decide per call-site during implementation | Same end-state with more drift. Committing upfront keeps the migration unambiguous; the escalation valve handles the unknown.    |

**Consequences:**

- D3 ("Remove if natural") is **superseded** by this decision.
- [07-tanstack-query](./07-tanstack-query.spec.md) is no longer
  conditional — its removal plan is the binding plan.
- `@tanstack/react-query` and `@tanstack/react-query-devtools` move from
  the **conditional remove** list in
  [01-toolchain](./01-toolchain-and-config.spec.md#package-json--dependency-churn)
  to the unconditional remove list.
- `src/lib/query-keys.ts`, all `queryOptions(...)` / `mutationOptions(...)`
  wrappers, and the `QueryClientProvider` shell are all deleted in the
  same pass.

## D18 — No success toasts

**Decision: Drop success toasts.** The redirect / loader re-render is the
feedback for a successful mutation. Error toasts (and inline field
errors) stay.

| Alternative                                                         | Why rejected                                                                                                                           |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Redirect-and-flash for create/update, `action()` toasts for buttons | Adds round-trips (search-param read in destination) and JS plumbing for low-value feedback the user already sees from the page change. |
| `form.recentlySuccessful` useEffect-driven toasts                   | Toast fires while the page is also re-rendering with fresh state — duplicate signal.                                                   |

**Consequences:**

- Recipe create action → `c.redirect('/recipe/:id')`. No toast.
- Recipe update / approve / block / delete → loader re-runs, UI
  reflects the new state. No toast.
- Errors (validation, 4xx, 5xx) still surface via `form.errors`,
  `form.error`, or `action()` `result.error`.
- `src/lib/toast-helpers.ts` and `src/components/ui/toast.tsx` stay
  (used for the error path).

## D17 — `<head>` configuration

**Decision: Use `void.json` `head.*` for all site-wide defaults.**
Per-page `head()` exports override fields (title, og: tags) when a
specific page needs them.

| Alternative                           | Why rejected                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Inline `<head>` in `pages/layout.tsx` | Closer to today's `__root.tsx` style, but every "I want a different title on this page" becomes a JSX prop drill instead of one export. |
| Mix global JSON + dynamic JSX         | Two sources of truth, harder to scan for "what tags actually ship".                                                                     |

**Consequences:**

- Site-wide tags (`title`, `viewport`, `theme-color`, `manifest`,
  `favicon`, fonts) declared in `void.json` `head.*`.
- `pages/layout.tsx` is purely about render structure (`<html>`,
  `<body>`, providers); no `<head>` JSX.
- A page that needs a custom title exports `head()`.

The full block is in
[05-routing-and-pages → `pages/layout.tsx`](./05-routing-and-pages.spec.md#pageslayouttsx--root-layout).

## D16 — Existing user data migration

**Decision: Scripted backfill from a renamed `legacy_user` table.**
Production has 3 users. `recipe.created_by` is a logical reference to
`user.id` (the user's Google `sub`) with no enforced FK. The cutover is
three sequenced SQL migrations: rename legacy table → Better Auth
schema migration → backfill into new tables.

| Alternative                                 | Why rejected                                                                                                                                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hand-typed SQL at cutover                   | With 3 user rows the temptation is real, but a typed ID is a stale recipe owner. Scripts are deterministic, reviewable in the PR diff, and locally testable.                                                                                                |
| Wipe + re-onboard                           | Each user comes back as `pending` and needs re-approval. Worse: `recipe.created_by` won't match new user IDs unless Better Auth reuses the Google sub for `id` (it does for the `account` table, but `user.id` is independently generated). Recipes orphan. |
| Application-level backfill on first sign-in | Adds runtime branching for a one-time migration. SQL is the right tool.                                                                                                                                                                                     |

**Consequences:**

- `void-migration/scripts/01_rename_legacy_user.sql` and
  `void-migration/scripts/02_backfill_users_from_legacy.sql` ship with
  this spec; see [scripts/README.md](./scripts/README.md).
- The cutover procedure is documented in
  [04-auth → Existing user data migration](./04-auth.spec.md#existing-user-data-migration).
- A pre-cutover `wrangler d1 export` snapshot is the rollback path.

## D15 — Status & role storage

**Decision: Better Auth `additionalFields`.** Extend Better Auth's `user`
table with `status` (`pending | active | blocked`) and `role`
(`admin | user`) via a root `auth.ts` `defineAuth({ user: { additionalFields: {...} } })`.

| Alternative                  | Why rejected                                                                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sibling `user_profile` table | Every read of status/role needs a join. Extra table, extra migration, extra typing surface, no benefit since `additionalFields` is supported by the framework. |

**Consequences:**

- `getUser()` from `void/auth` returns a user typed with `status` and `role`.
- Schema migration adds the columns to Better Auth's `user` table.
- The middleware in [04-auth → Approval gate](./04-auth.spec.md#approval-gate-and-middleware)
  reads these fields directly and exposes them via `useShared()`.

## D14 — R2 read cache strategy

**Decision: Drop the custom `caches.default` wrapper, rely on
`Cache-Control` + CDN.** Delete `src/lib/cache-manager.ts` entirely.
`routes/api/image/[id].ts` and `routes/api/video/[id].ts` return responses
with `public, max-age=86400, stale-while-revalidate=604800` and let
Cloudflare's edge / Void's CDN handle caching.

| Alternative                          | Why rejected                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keep custom `caches.default` wrapper | Adds runtime dependency and a failure mode (key collisions) for the same effective TTL the response header already gets from the upstream CDN.                     |
| Void ISR via `routing.revalidate`    | ISR is page-shaped, not arbitrary-route-shaped. Coverage of `routes/api/image/[id]` is uncertain without verification, and any gap would only surface post-deploy. |

**Consequences:**

- `src/lib/cache-manager.ts` is deleted, not renamed.
- Route handlers are simpler — no wrapping closure.
- If miss-rate becomes a problem later, an inline cache wrapper can be
  added without changing response shape.

## D13 — R2 binding name

**Decision: Rename the R2 binding from `R2_BUCKET` to `STORAGE`** (Void's
default). The bucket itself (`recipe-organizer`) and all object keys are
untouched — only the worker-side env identifier changes.

| Alternative                               | Why rejected                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Keep `R2_BUCKET` via `void.json` override | Extra config in `inference.bindings.storage: "R2_BUCKET"` for no UX gain. No external system references the old binding name today. |

**Consequences:**

- `import { storage } from 'void/storage'` works without overrides.
- Existing `env.R2_BUCKET` references — none should remain after
  [03-bindings](./03-bindings.spec.md) — must be cleared during the bindings phase.
- The deployment manifest names the binding `STORAGE`.

## D12 — Schema-derived validators

**Decision: Adopt `void/drizzle-valibot`-derived schemas for DB-aligned
fields.** Hand-written Valibot lives on for the non-DB extras (image,
ingredient groups, linked recipes) by spreading the derived schema's
`.entries` into a wrapper object.

| Alternative                   | Why rejected                                                                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keep all schemas hand-written | Boilerplate, and the validator drifts from the DB shape every time a column is added or renamed. The migration is the right time to switch over.                                           |
| Mixed (new code only)         | Leaves inconsistency between old and new validators. The migration is already rewriting every action/route, so doing the derive-from-schema swap in the same pass is the lower total cost. |

**Consequences:**

- Where the migration touches an action body that aligns with a table,
  `createInsertSchema` / `createUpdateSchema` from `void/drizzle-valibot`
  is the source. Custom column rules come via the second-argument
  refinement callback.
- The migration template for action handlers is documented in
  [02-data-layer → Schema-derived validators](./02-data-layer.spec.md#schema-derived-validators).

## D11 — Production D1 migration lineage

**Decision: Path A — preserve lineage.** Flatten each existing
`migrations/<timestamp>_<name>/migration.sql` to a single
`db/migrations/<timestamp>_<name>.sql`, keeping the original timestamps
and ordering. The Cloudflare-side `__drizzle_migrations` (or Void
equivalent) tracking-table reconciliation is **owned by the project
owner**, not scripted by this spec.

| Alternative                 | Why rejected                                                                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Path B — baseline reset     | Loses migration history. Acceptable in principle but unnecessary: the lineage flatten is mechanical and the owner has tooling/access to reconcile the remote tracking table. |
| Deferred (try A, fall to B) | No reason to defer once the owner has committed to handling the reconciliation. Path A is now the spec target.                                                               |

**Consequences:**

- `db/migrations/` ends up with one `.sql` per legacy migration directory,
  preserving timestamps.
- `void db generate` after the flatten **must report no drift**. If it
  generates a new migration, the flatten was incomplete.
- `wrangler deploy` to production is gated on the owner having reconciled the
  remote tracking table — see [02-data-layer → Migrations directory](./02-data-layer.spec.md#migrations-directory).

## D10 — Binding declaration style

**Decision: Declare `inference.bindings` explicitly in `void.json`.** The
spec's `void.json` ships with `{ "inference": { "bindings": { "db": true, "storage": true } } }`.

| Alternative                | Why rejected                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-inference (no config) | Bindings become emergent from imports. A future PR that removes the last `db` or `storage` import would silently drop the binding from the deploy manifest. Explicit declaration catches this at config-review time. |

**Consequences:**

- The binding contract lives in one place (`void.json`).
- Adding a new binding (e.g. KV) requires both adding it to the code and
  updating `void.json` — by design.

## D9 — Validation library

**Decision: Valibot, project-wide.** The repo already completed the
Zod → Valibot migration before this work started; every validator in
`src/` imports from `'valibot'`, and `valibot@1.2.0` is the only validator
dependency. Schema-derived validators come from `void/drizzle-valibot`.

| Alternative                                    | Why rejected                                                                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reintroduce Zod for new code                   | Two validator libraries in one project. No upside — Valibot is Standard-Schema compliant, so Void's `withValidator`/`useForm` accept it natively. |
| Use the built-in `void/env` helpers everywhere | Fine for `env.ts`, but doesn't cover action/page/route validators. Valibot remains the validator for those.                                       |

**Consequences:**

- `void/drizzle-valibot` is the source of schema-derived schemas
  (`createInsertSchema`, `createUpdateSchema`, `createSelectSchema`).
- No `zod` dependency must reappear in `package.json`.
- Code examples in this migration spec use Valibot syntax (`v.object`,
  `v.pipe`, `v.minLength`, `v.string`, `v.instance(File)`, etc.).

---

## Rejected wholesale alternatives

For the record, these were considered as global re-frames and rejected:

- **"Rebuild from scratch on `npx void init`"** — would be cleaner but loses
  git history, all spec docs under `docs/`, and forces a one-shot cutover. The
  spec assumes incremental, branch-isolated migration with verifiable gates.
- **"Migrate to Void but keep a separate `apps/` workspace for the old code"** —
  no value; the old code has no second consumer.
