---
title: Auth
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: []
---

## 2. Problem Statement

Recipe Organizer is a family-scoped app: only invited/approved users may access recipes, and only admins may manage
shared reference data (ingredients, units, users). The app needs an authentication layer that:

- `[G-1]` Lets members sign in with a zero-friction identity provider (Google OAuth) — no password management.
- `[G-2]` Gates access behind an admin approval step, so that arbitrary Google accounts cannot read/write recipes.
- `[G-3]` Supports role-based access (user / admin) so destructive operations (delete recipe, manage units/users) are
  admin-only.
- `[G-4]` Supports a permanent "blocked" state for revoked users, distinct from "never approved".
- `[G-5]` Persists identity across requests via a secure cookie session, without requiring a JWT infrastructure.
- `[G-6]` Does not block local development — in dev, auth is auto-mocked as an admin user.

## 3. Key Design Decisions

| Decision                         | Choice                                                                  | Rationale                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `[KD-1]` Identity provider       | Google OAuth 2.0 (only)                                                 | Target users already have Google accounts; avoids password storage & recovery flows.                |
| `[KD-2]` Session storage         | Signed cookie via TanStack Start `useSession` (app + OAuth state sides) | No DB session table needed; Cloudflare Workers-compatible; short OAuth state lifecycle is built-in. |
| `[KD-3]` New-user lifecycle      | `pending` → `active` (admin approves) or `blocked`                      | Prevents any Google account from self-onboarding; keeps audit trail vs hard-deleting.               |
| `[KD-4]` `user.id` source        | Google subject ID (text PK)                                             | Stable per-account identifier; avoids separate UUID for OAuth-created users.                        |
| `[KD-5]` Dev bypass              | In `import.meta.env.DEV`, `getAuthUser` returns a mocked admin          | Avoids OAuth redirect loops during local development.                                               |
| `[KD-6]` Route-level enforcement | `authGuard(role?)` middleware on server functions + route `beforeLoad`  | Keeps per-endpoint authorization explicit, no ambient global guard.                                 |
| `[KD-7]` OAuth CSRF protection   | CSPRNG-generated `state` stored in dedicated `oauth` cookie session     | Separates short-lived OAuth state from long-lived app session.                                      |

## 4. Principles & Intents

- `[PI-1]` **Fail closed** — any unknown/blocked/pending user is redirected to `/auth/login` with a typed error code,
  never silently allowed through.
- `[PI-2]` **Typed error codes** — auth failures use the `AuthError` union (see `api/constants.ts`), surfaced via the
  `?error=` search param on `/auth/login`. The UI is the only component that maps codes to human text.
- `[PI-3]` **No sensitive data in cookies** — the app session cookie carries only `userId`; the OAuth session carries
  only the transient `oauthState`. All other user attributes (role, status, email) are read from the DB on each request.
- `[PI-4]` **Admin-only mutations at the API boundary** — role checks happen on the server function via
  `authGuard('admin')`, not in the UI. The UI may hide admin affordances, but must not be the only gate.

## 5. Non-Goals

- `[NG-1]` Email/password login, magic links, SMS, or any non-Google identity provider.
- `[NG-2]` Self-service signup without admin approval.
- `[NG-3]` Multi-tenant / org-scoped auth — this is a single shared tenant.
- `[NG-4]` Fine-grained permissions beyond `user` vs `admin` (e.g., per-recipe ACLs).
- `[NG-5]` Password recovery / account recovery flows (delegated to Google).
- `[NG-6]` 2FA / step-up auth at the app layer (delegated to Google).

## 6. Caveats

- `[C-1]` `user.id` is whatever Google returns as the OAuth subject ID. If a user is manually created by an admin
  before they ever sign in with Google, the manual `id` must match Google's subject ID or the Google sign-in will
  fork a second row under the same email — which will collide with the `email` UNIQUE constraint and fail. In
  practice, admin-created users are created with a UUID-ish string and are expected to be replaced by Google flow.
- `[C-2]` Blocked and pending states are checked both in the OAuth callback (at login time) **and** in `authGuard`
  (on every subsequent request). If an admin blocks a user mid-session, the next server-function call will
  redirect them to `/auth/login`.
- `[C-3]` `authGuard('admin')` throws a generic `Error('Permission denied')` rather than a redirect — the intent is
  to surface this as an error boundary / toast, not as a silent redirect, because the UI should never expose admin
  affordances to non-admins in the first place.
- `[C-4]` `getAuthUser` silently returns `undefined` when not logged in (no redirect). It's the caller's job
  (route guard, middleware) to translate `undefined` into a redirect.

## 7. High-Level Components

| Component            | Module type        | Responsibility                                                                  | Public API surface                                               |
| -------------------- | ------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| OAuth flow           | Server functions   | Initiate Google OAuth; handle callback; create-or-validate user; set session    | `initiateGoogleAuth()`, `handleGoogleCallback(code, state)`      |
| Current-user reader  | Server function    | Read app session cookie, look up `user` row, return `user` or `undefined`       | `getAuthUser()`                                                  |
| Logout               | Server function    | Clear the app session cookie                                                    | `logout()`                                                       |
| Route guard          | Server middleware  | Enforce "logged in and not blocked/pending", optional admin role check          | `authGuard(role?)`                                               |
| Error vocabulary     | Types              | Typed union of auth error codes shared by server functions and `/auth/login` UI | `AuthError`                                                      |
| Login route          | HTTP route handler | Render login page; render error banner from `?error=` search param              | `GET /auth/login`                                                |
| OAuth callback route | HTTP route handler | Bridge from Google's redirect back to `handleGoogleCallback`                    | `GET /api/auth/google/callback`                                  |
| Session cookies      | Shared helper      | Wrap TanStack Start `useSession` for app + OAuth cookies                        | `useAppSession()`, `useOAuthSession()` (in `src/lib/session.ts`) |

## 8. Detailed Design

Implementation lives at the following entry points. For current signatures and behavior, read the code.

| Component            | Entry point                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| OAuth initiation     | `src/features/auth/api/google-auth.ts` → `initiateGoogleAuth`                             |
| OAuth callback       | `src/features/auth/api/google-auth.ts` → `handleGoogleCallback`                           |
| Current-user reader  | `src/features/auth/api/get-auth-user.ts` → `getAuthUser`                                  |
| Logout               | `src/features/auth/api/logout.ts` → `logout`                                              |
| Route guard          | `src/features/auth/lib/auth-guard.ts` → `authGuard`                                       |
| Error codes          | `src/features/auth/api/constants.ts` → `AuthError`                                        |
| Login page           | `src/routes/auth/login.tsx`                                                               |
| OAuth callback route | `src/routes/api/auth/google/$id.ts` (and/or siblings under `src/routes/api/auth/google/`) |
| Session cookies      | `src/lib/session.ts` → `useAppSession`, `useOAuthSession`                                 |
| User DB schema       | `src/lib/db/schema/user.ts`                                                               |

Key invariants to preserve in future changes:

- The OAuth callback MUST verify that the incoming `state` matches the `oauthState` stored in the OAuth cookie
  session before exchanging the code — see `[KD-7]` / `[PI-1]`.
- `authGuard` MUST check `status === 'blocked'` and `status === 'pending'` before the role check — a blocked admin
  should still be blocked.
- New users MUST be created with `status: 'pending'` by the OAuth callback, never `'active'`. Only admin approval
  (see users feature spec) promotes them to active.

## 9. Verification Criteria

- `[VC-1]` Signing in with a Google account whose email is unknown creates a row with `status='pending'`,
  `role='user'`, and redirects back to `/auth/login?error=account_pending`. (Manual — Google OAuth flow.)
- `[VC-2]` Signing in as a `pending` user redirects to `/auth/login?error=account_pending`.
- `[VC-3]` Signing in as a `blocked` user redirects to `/auth/login?error=account_blocked`.
- `[VC-4]` Signing in as an `active` user sets the app session cookie and redirects into the app.
- `[VC-5]` A server function wrapped with `authGuard()` returns 302→`/auth/login` (or throws `redirect`) when no
  `userId` cookie is set.
- `[VC-6]` A server function wrapped with `authGuard('admin')` throws `Error('Permission denied')` for a non-admin
  active user and passes through for an admin user.
- `[VC-7]` A callback invocation whose `state` does not match the OAuth cookie redirects to
  `/auth/login?error=invalid_state`. (Security regression guard.)
- `[VC-8]` `logout()` clears the app session cookie; a subsequent `getAuthUser()` returns `undefined`.
- `[VC-9]` In `import.meta.env.DEV`, `getAuthUser()` returns a mocked admin user even without a session cookie.
- `[VC-10]` Lint + typecheck pass: `pnpm lint`, `pnpm typecheck`.

## 10. Open Questions

- `[OQ-1]` Should `authGuard('admin')` redirect to `/auth/login` instead of throwing? Current behavior
  (throw) treats "non-admin hits admin endpoint" as a programmer/UI bug rather than an auth failure. No change
  planned.
- `[OQ-2]` Do we need a per-user audit log (last sign-in, blocked-by-whom)? Not in scope today.
