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

**Decision: Investigate, then choose.** Open question — see
[03-bindings](./03-bindings.spec.md#open-question-cloudflare-images) for the
three options and the data needed to pick. Marked as **blocking** in
[index.spec.md → Open decisions](./index.spec.md#open-decisions-still-blocking-implementation).

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

**Decision: Default to `void deploy` (Void Cloud).** Switch to direct
`wrangler deploy` only if D5 forces it (Cloudflare Images binding required).

---

## Rejected wholesale alternatives

For the record, these were considered as global re-frames and rejected:

- **"Rebuild from scratch on `npx void init`"** — would be cleaner but loses
  git history, all spec docs under `docs/`, and forces a one-shot cutover. The
  spec assumes incremental, branch-isolated migration with verifiable gates.
- **"Migrate to Void but keep a separate `apps/` workspace for the old code"** —
  no value; the old code has no second consumer.
