# 04 — Authentication (custom Google OAuth → `void/auth`)

This is the highest-risk part of the migration because it touches user data
and the login UX. Resolve [Existing user data migration](#existing-user-data-migration)
before merging anything to main.

## Current state

- `src/features/auth/api/google-auth.ts` — hand-rolled Google OAuth code +
  state PKCE + callback flow + custom error redirect mapping
- `src/features/auth/api/get-auth-user.ts` — reads `useAppSession()` and
  returns the `user` row by `id`
- `src/features/auth/api/logout.ts` — clears session
- `src/features/auth/api/constants.ts` — error message → query-param mapping
- `src/features/auth/lib/auth-guard.ts` — TanStack `createMiddleware`-based
  guard for server functions
- `src/lib/session.ts` — `useAppSession` + `useOAuthSession` (TanStack Start
  `useSession` over signed cookies)
- `src/routes/auth/login.tsx` — login page reading `?error=…` for messages
- `src/routes/api/auth/google/callback.ts` — server function entry point
- Existing `user` table:
  ```
  user { id: text PK, email: text unique, role: 'admin'|'user', status: 'pending'|'blocked'|'active', … }
  ```
  Where `user.id` = the Google user ID (stable across logins).

## Target state

- Better Auth via `void/auth`, mounted at `/api/auth/*`
- Google provider only (no email/password)
- `void/auth` server helpers: `requireAuth(c)`, `getUser()`, `getSession()`
- `void/client` `auth` client for sign-in/out
- Better Auth's standard schema (`user`, `account`, `session`, `verification`)
  managed by Void migrations
- Existing `user.role` and `user.status` preserved via a Better Auth user
  extension (Better Auth's `additionalFields`)

## `void.json` auth block

```json
{
  "auth": {
    "providers": ["google"]
  }
}
```

This wires Google provider with credentials from
`AUTH_GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_CLIENT_SECRET` (declared in
[`env.ts`](./01-toolchain-and-config.spec.md#envts--typed-env-schema)).

## Preserving `status` and `role`

The app's invite-only gate (`pending`/`active`/`blocked` statuses + `admin`
role) is **business logic, not auth state**. Two ways:

### Pattern A — Better Auth `additionalFields` (recommended)

Create a root `auth.ts` with `defineAuth(...)`:

```ts
// auth.ts
import { defineAuth } from 'void/auth'

export default defineAuth(({ defaults }) => ({
  ...defaults,
  user: {
    additionalFields: {
      status: { type: 'string', defaultValue: 'pending', required: true },
      role: { type: 'string', defaultValue: 'user', required: true },
    },
  },
  trustedOrigins: [
    /* … */
  ],
}))
```

The `user` table gets `status` and `role` columns managed by Better Auth's
schema. Reading these in a loader:

```ts
import { getUser } from 'void/auth'
const user = getUser() // includes status, role as typed fields
```

### Pattern B — Sibling `user_profile` table

Keep Better Auth's `user` table untouched. Add `user_profile` with
`userId` FK and `status` + `role` columns. Reads need a join.

**Recommended: Pattern A.** Smaller surface, typed reads, no joins. The
existing `pending`/`blocked` flow is centralized in middleware (see
[Approval gate](#approval-gate-and-middleware)).

## Approval gate and middleware

The current `getAuthUser` returns `null` if the session has no user or if
the DB row is `blocked`. The approval-on-signup flow:

1. Google OAuth callback → user row inserted with `status: 'pending'`
2. Admin approves → row updated to `status: 'active'`
3. Until then, the user is signed-in-but-not-active

This becomes a middleware that runs after Better Auth populates the session:

```ts
// middleware/02.account-status.ts
import { defineMiddleware } from 'void'
import { getUser } from 'void/auth'

declare module 'void' {
  interface CloudContextVariables {
    shared: {
      auth: {
        user: AuthUserWithStatus | null
        isPending: boolean
        isBlocked: boolean
        isAdmin: boolean
      }
    }
  }
}

export default defineMiddleware(async (c, next) => {
  const user = await getUser()
  c.set('shared', {
    auth: {
      user: user && user.status !== 'blocked' ? user : null,
      isPending: user?.status === 'pending',
      isBlocked: user?.status === 'blocked',
      isAdmin: user?.role === 'admin',
    },
  })
  await next()
})
```

This shape is read on the client via `useShared()` from `@void/react` —
replacing the current `Route.useRouteContext()` pattern in `__root.tsx`
and `index.tsx`.

## Sign-in / sign-out UX

The current login UI is a single "Sign in with Google" button that hits the
`initiateGoogleAuth` server function. Replace with `void/client`:

```tsx
// pages/auth/login.tsx
import { auth } from 'void/client'

export default function Login() {
  return <button onClick={() => auth.signIn.social({ provider: 'google', callbackURL: '/' })}>Sign in with Google</button>
}
```

Sign-out:

```tsx
import { auth } from 'void/client'
await auth.signOut()
```

Error messages: the current implementation surfaces errors via
`?error=email_not_verified|account_pending|account_blocked|invalid_state|error_communicating_with_google`.
Better Auth's social flow has its own error reporting via the callback
response and client SDK; the **pending/blocked** branches need explicit
rendering by the middleware-driven `isPending`/`isBlocked` flags in
`useShared()`. A "Pending approval" page replaces the error redirect for
that branch.

`src/features/auth/api/constants.ts` is removed in favor of:

- Built-in Better Auth errors (network/state)
- App-level pending/blocked rendering in a layout or guard

## Route guarding

Current pattern (TanStack server fn middleware):

```ts
.middleware([authGuard()])
```

Target: use `requireAuth` from `void/auth` inline in actions / route handlers:

```ts
import { defineHandler } from 'void'
import { requireAuth } from 'void/auth'

export const action = defineHandler(async (c) => {
  const user = requireAuth(c) // throws 401 if no session
  if (user.status !== 'active') throw new Error('account not active')
  // … mutation …
})
```

For page-level guards (current `beforeLoad` in `__root.tsx`), put the
status check in the page loader and redirect:

```ts
// pages/recipe/new.server.ts
import { defineHandler } from 'void'
import { requireAuth } from 'void/auth'

export const loader = defineHandler(async (c) => {
  const user = requireAuth(c)
  if (user.status !== 'active') return c.redirect('/auth/pending')
  return {
    /* … */
  }
})
```

`src/features/auth/lib/auth-guard.ts` is **deleted**.

## Existing user data migration

This is the **blocking decision** flagged in
[index.spec.md](./index.spec.md#open-decisions-still-blocking-implementation).
Two paths:

### Option 1 — Backfill into Better Auth tables

Write a one-shot migration script:

1. Generate Better Auth's initial migration via `void db generate` (gives
   `user`, `account`, `session`, `verification` schemas).
2. The schema migration includes the additionalFields (`status`, `role`).
3. Write a data migration that:
   - Copies every existing `user` row into Better Auth's `user` table,
     preserving `id`, `email`, `status`, `role`.
   - Inserts into Better Auth's `account` table with `provider: 'google'`,
     `providerAccountId: user.id` (since the current `user.id` is the
     Google user ID), and the Better Auth-required hash placeholders for
     non-password providers.
4. Drops the **old** `user` table only after the backfill is verified.

Risk: Better Auth's `account` table requires fields that aren't present in
the current schema (`accessToken`, `refreshToken`, etc., though most are
nullable for social providers). Need to check Better Auth's exact D1 schema
in the Void output of `void db generate` before writing the data migration.

### Option 2 — Wipe and re-onboard

Acceptable only if losing user data (recipes survive — `recipe.createdBy`
references `user.id`) is OK. Probably **not** OK because recipes reference
users.

**Recommended: Option 1.** Block migration on writing and testing the data
migration script. The user list is small enough that hand-verifying
post-migration is feasible.

## Files deleted at the end of this phase

- `src/features/auth/api/google-auth.ts`
- `src/features/auth/api/constants.ts`
- `src/features/auth/lib/auth-guard.ts`
- `src/features/auth/api/get-auth-user.ts` (replaced by `getUser()` from `void/auth`)
- `src/features/auth/api/logout.ts` (replaced by `auth.signOut()` from `void/client`)
- `src/lib/session.ts`
- `src/routes/api/auth/google/callback.ts`

## Files created

- `auth.ts` (project root) — `defineAuth` config
- `middleware/02.account-status.ts` — pending/blocked surfacing
- `pages/auth/login.tsx` — replaces `src/routes/auth/login.tsx`
- `pages/auth/pending.tsx` — new "awaiting approval" page

## Verification gate

This phase is "done" when:

- `void db generate` produces auth tables alongside the app schema
- `void db migrate` applies them locally and the data migration script
  populates existing users
- Sign-in with Google works end-to-end on `vp dev`
- A `pending` user lands on `/auth/pending`, a `blocked` user lands on
  `/auth/login?error=blocked` (or equivalent), and an `active` user reaches
  `/`
- `requireAuth` correctly 401s on protected actions when not signed in
- Admin-gated user-management routes (`/settings/users`) deny non-admin users
- No imports remain from `@tanstack/react-start/server` (the `useSession`
  surface)
