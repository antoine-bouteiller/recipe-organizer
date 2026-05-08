---
title: Auth Feature Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, auth, oauth, sessions]
---

# Introduction

This document specifies the authentication feature of the recipe-organizer application. The feature provides Google
OAuth 2.0 sign-in, server-managed session cookies (TanStack `useSession`), an admin-approval lifecycle for new
accounts, and a server-side route guard for protected routes and server functions. It is implemented in
`src/features/auth/` and integrated with the data layer (`src/lib/db/schema/user.ts`) and the platform layer
(`src/lib/session.ts`, Cloudflare Workers `env`).

## 1. Purpose & Scope

### 1.1 Purpose

Define the authoritative behavior, contracts, constraints, and acceptance criteria for:

- The Google OAuth 2.0 sign-in flow (initiation + callback + token exchange + user-info fetch + session creation).
- The user account lifecycle (`pending` -> `active` / `blocked`) gating access to the application.
- Session management (`app-session`, `oauth-session`) and CSRF protection (`state` parameter).
- The `authGuard` server middleware that protects server functions and routes.
- The login page (`/auth/login`) and OAuth callback route (`/api/auth/google/callback`).
- The development-mode bypass that returns a synthetic admin user.

### 1.2 In Scope

- Server functions: `initiateGoogleAuth`, `getAuthUser`, `logout`.
- Server-only function: `handleGoogleCallback`.
- Middleware: `authGuard(role?)`.
- Session helpers: `useAppSession`, `useOAuthSession`.
- Route handlers: `/auth/login` (page), `/api/auth/google/callback` (GET).
- Auth error enum: `AuthError`.
- Required Cloudflare Workers env / Vite env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`,
  `VITE_PUBLIC_URL`.

### 1.3 Out of Scope

- User CRUD and role/status mutation by administrators (covered by `../users/users.spec.md`).
- Email/password authentication, magic links, MFA.
- Refresh-token handling and long-lived offline access (the request uses `access_type=online`).
- Rate limiting, IP-based blocking, audit logging.

## 2. Definitions

| Term                 | Definition                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| OAuth 2.0            | The Google authorization-code flow used to authenticate users (`response_type=code`, `scope=openid email profile`).               |
| Authorization code   | Short-lived code returned by Google to the callback route; exchanged server-side for an access token.                             |
| Access token         | Bearer token returned by Google's token endpoint; used once to fetch the Google user profile.                                     |
| `state` parameter    | Random hex string generated on initiation and verified on callback to prevent CSRF in the OAuth handshake.                        |
| `app-session`        | Application session cookie; carries `userId`. 30-day max age. `httpOnly`, `sameSite=lax`, `secure` in production.                 |
| `oauth-session`      | Short-lived OAuth-handshake cookie; carries `oauthState`. `httpOnly`, `sameSite=lax`, `secure` in production.                     |
| `useSession`         | TanStack Start helper from `@tanstack/react-start/server` used to read/write encrypted cookie sessions keyed by `SESSION_SECRET`. |
| `authGuard(role?)`   | Server middleware (`createMiddleware({ type: 'function' })`) that loads the auth user and gates access by status/role.            |
| User status          | One of `pending`, `active`, `blocked`. Gates whether the user may access the app.                                                 |
| User role            | One of `user`, `admin`. Used by `authGuard('admin')` to gate admin-only operations.                                               |
| `AuthError`          | Union of error codes propagated to the login page via the `?error=` query string.                                                 |
| DEV bypass           | Conditional branch in `getAuthUser` that returns a synthetic admin user when `import.meta.env.DEV` is true.                       |
| Server function      | A function created via `createServerFn` from `@tanstack/react-start`, callable from the client over RPC.                          |
| Server-only function | A function created via `createServerOnlyFn` from `@tanstack/react-start`; never bundled into the client.                          |
| Route context        | Object available to routes via `beforeLoad`; the root route injects `authUser` and `isAdmin` for downstream routes.               |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements (REQ)

- **REQ-001** The system SHALL expose `initiateGoogleAuth` as a `POST` server function that generates a 16-byte random
  hex `state`, persists it in `oauth-session.oauthState`, and redirects the browser to
  `https://accounts.google.com/o/oauth2/v2/auth` with the parameters: `access_type=online`,
  `client_id=env.GOOGLE_CLIENT_ID`, `prompt=select_account`,
  `redirect_uri=${VITE_PUBLIC_URL}/api/auth/google/callback`, `response_type=code`, `scope=openid email profile`,
  `state=<generated>`.
- **REQ-002** The system SHALL expose a GET handler at `/api/auth/google/callback` that reads `code` and `state` from
  the URL search params and invokes `handleGoogleCallback(code, state)`. On success it SHALL redirect to `/`. If `code`
  or `state` is missing it SHALL throw `Error('Missing code or state')`.
- **REQ-003** `handleGoogleCallback` SHALL verify that the received `state` is non-empty AND equals
  `oauth-session.oauthState`. On mismatch it SHALL redirect to `/auth/login?error=invalid_state`.
- **REQ-004** `handleGoogleCallback` SHALL exchange `code` at `https://oauth2.googleapis.com/token` (POST,
  `application/x-www-form-urlencoded`) with `grant_type=authorization_code`, `client_id`, `client_secret`,
  `redirect_uri`, and `code`. On non-OK response or missing `access_token` it SHALL redirect to
  `/auth/login?error=error_communicating_with_google`.
- **REQ-005** `handleGoogleCallback` SHALL fetch user info from `https://www.googleapis.com/oauth2/v2/userinfo` with
  `Authorization: Bearer <access_token>`. On non-OK response or when any of `id`, `email`, `name` is missing, it SHALL
  redirect to `/auth/login?error=error_communicating_with_google`.
- **REQ-006** `handleGoogleCallback` SHALL look up an existing user by `email`. If none exists, it SHALL insert a new
  row with `{ id: userInfo.id, email: userInfo.email, role: 'user', status: 'pending' }` and redirect to
  `/auth/login?error=account_pending`. The Google `id` is used as the database `id`.
- **REQ-007** When the existing user has `status === 'pending'`, `handleGoogleCallback` SHALL redirect to
  `/auth/login?error=account_pending`. When `status === 'blocked'`, it SHALL redirect to
  `/auth/login?error=account_blocked`. Only `status === 'active'` users SHALL receive a session.
- **REQ-008** On successful authentication, `handleGoogleCallback` SHALL update `app-session` with
  `{ userId: existingUser.id }` and return the user.
- **REQ-009** `getAuthUser` SHALL be a `GET` server function wrapped by `withServerError` that returns the current
  user. When `import.meta.env.DEV` is true it SHALL return the synthetic admin user
  `{ email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }`. Otherwise it SHALL load the user via
  `getDb().query.user.findFirst({ where: { id: session.data.userId } })` and return `undefined` when no session or no
  matching row exists.
- **REQ-010** `logout` SHALL be a `POST` server function wrapped by `withServerError` that calls `session.clear()` on
  `app-session` and returns `{ success: true }`.
- **REQ-011** `authGuard(role?)` SHALL load the auth user via `getAuthUser` and: redirect to `/auth/login` if no user;
  redirect to `/auth/login?error=account_blocked` if `status === 'blocked'`; redirect to
  `/auth/login?error=account_pending` if `status === 'pending'`; throw `Error('Permission denied')` if `role === 'admin'`
  AND `user.role !== 'admin'`. On success it SHALL forward `{ context: { user } }` to `next`.
- **REQ-012** The `/auth/login` route SHALL render a Google sign-in button that invokes `initiateGoogleAuth` via
  `useServerFn`. It SHALL parse `?error=` via the Zod schema `z.object({ error: z.string().optional() })` and surface
  the localized error via `toastManager.add({ type: 'error', description })`.
- **REQ-013** The `/auth/login` route's `beforeLoad` SHALL redirect authenticated users (`context.authUser` truthy) to
  `/`.
- **REQ-014** The root route SHALL inject `authUser` and `isAdmin` into the route context so that downstream routes,
  including `/auth/login`, can read them in `beforeLoad`.

### 3.2 Security Requirements (SEC)

- **SEC-001** Both `app-session` and `oauth-session` cookies SHALL be `httpOnly` and `sameSite=lax`, and SHALL set
  `secure: true` whenever `import.meta.env.PROD` is true.
- **SEC-002** Both sessions SHALL be encrypted/signed using `env.SESSION_SECRET` as the password argument to
  `useSession`. `SESSION_SECRET` MUST NOT be exposed to the client.
- **SEC-003** The OAuth `state` parameter SHALL be 16 bytes from `crypto.getRandomValues` encoded as lowercase hex,
  generated per initiation, and verified by strict equality on callback. Mismatch SHALL produce
  `error=invalid_state`.
- **SEC-004** `GOOGLE_CLIENT_SECRET` SHALL only be read inside server-only code (`handleGoogleCallback`) via
  `cloudflare:workers` `env`.
- **SEC-005** The OAuth flow SHALL request `access_type=online` (no refresh token issued) and `prompt=select_account`.
- **SEC-006** New users SHALL be created with `status: 'pending'` and SHALL NOT receive an `app-session` cookie until
  promoted to `active` by an administrator (see `../users/users.spec.md`).
- **SEC-007** The DEV bypass in `getAuthUser` SHALL only execute when `import.meta.env.DEV` is true and MUST NOT ship
  in production builds.
- **SEC-008** `oauth-session` SHALL only carry `oauthState` and SHALL NOT carry `userId` or any privileged identifier.

### 3.3 Constraints (CON)

- **CON-001** Runtime is Cloudflare Workers. All server code SHALL be compatible with the Workers runtime (Web Crypto,
  `fetch`, no Node-only APIs).
- **CON-002** The user `id` column is `TEXT PRIMARY KEY` and SHALL be set to the Google user `id` returned by
  `userinfo`. The `email` column is `notNull().unique()`.
- **CON-003** `role` is `text({ enum: ['user', 'admin'] })`, `notNull()`, default `'user'`. `status` is
  `text({ enum: ['pending', 'active', 'blocked'] })`, `notNull()`, default `'active'`. Note: the database default for
  `status` is `'active'`, but `handleGoogleCallback` MUST explicitly set `'pending'` for new sign-ups.
- **CON-004** The `app-session` cookie `maxAge` is `60 * 60 * 24 * 30` (30 days). The inline source comment "7 days"
  is incorrect; the value is 30 days.
- **CON-005** `oauth-session` has no explicit `maxAge` and is treated as a session cookie scoped to the OAuth handshake.
- **CON-006** `VITE_PUBLIC_URL` SHALL be set at build/runtime so that the OAuth `redirect_uri` resolves to
  `${VITE_PUBLIC_URL}/api/auth/google/callback`. The Google OAuth client SHALL whitelist this exact URI.
- **CON-007** `getAuthUser` is wrapped by `withServerError`; it MUST surface failures via that error envelope rather
  than throwing raw exceptions.
- **CON-008** `authGuard` is a function-type middleware (`createMiddleware({ type: 'function' })`) and MUST be applied
  to server functions, not as a route loader.

### 3.4 Guidelines (GUD)

- **GUD-001** Use `useServerFn(initiateGoogleAuth)` from a client component to start the OAuth flow; do not call
  `initiateGoogleAuth` directly from server code.
- **GUD-002** Surface `AuthError` codes only via the `?error=` query string on `/auth/login`. Do not embed them in
  toasts triggered from server code.
- **GUD-003** Read the auth user from route context (`context.authUser`) where possible rather than calling
  `getAuthUser` ad-hoc inside components.
- **GUD-004** New protected server functions SHOULD compose `authGuard()` (or `authGuard('admin')` for admin-only
  operations) instead of re-implementing user lookup.

### 3.5 Patterns (PAT)

- **PAT-001** OAuth handshake = generate `state` -> store in `oauth-session` -> redirect to Google -> callback verifies
  `state` -> exchange code -> fetch userinfo -> upsert user -> set `app-session.userId`.
- **PAT-002** Error propagation = throw `redirect({ to: '/auth/login', search: { error } })` from server code; the
  login page reads `error` via `validateSearch`.
- **PAT-003** Session writes use `await session.update(partial)`; logout uses `await session.clear()`.
- **PAT-004** Middleware composition: `createMiddleware({ type: 'function' }).server(async ({ next }) => { ... return next({ context: { user } }) })`.

## 4. Interfaces & Data Contracts

### 4.1 Server Functions

| Name                   | Method | File                                                 | Signature (return)                                                            |
| ---------------------- | ------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `initiateGoogleAuth`   | POST   | `src/features/auth/api/google-auth.ts`               | Throws `redirect({ href })` to Google; never returns normally.                |
| `handleGoogleCallback` | n/a    | `src/features/auth/api/google-auth.ts` (server-only) | `(code: string, state: string) => Promise<User>` (throws redirects on error). |
| `getAuthUser`          | GET    | `src/features/auth/api/get-auth-user.ts`             | `Promise<User \| undefined>` (or DEV synthetic admin).                        |
| `logout`               | POST   | `src/features/auth/api/logout.ts`                    | `Promise<{ success: true }>`.                                                 |

### 4.2 Routes

| Route                       | Type      | File                                     | Behavior                                                                           |
| --------------------------- | --------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `/auth/login`               | Page      | `src/routes/auth/login.tsx`              | Renders sign-in card. Redirects to `/` if `context.authUser`. Validates `?error=`. |
| `/api/auth/google/callback` | API (GET) | `src/routes/api/auth/google/callback.ts` | Reads `code` & `state`, calls `handleGoogleCallback`, redirects to `/`.            |

### 4.3 Auth Error Codes

```
authErrors = {
  account_blocked,
  account_pending,
  error_communicating_with_google,
  invalid_state,
  signup_disabled,
}
type AuthError = keyof typeof authErrors
```

The login page maps these to French messages:

| Code                              | Message (FR)                                                      |
| --------------------------------- | ----------------------------------------------------------------- |
| `signup_disabled`                 | "Veuillez contacter l'administrateur pour vous inscrire"          |
| `account_pending`                 | "Votre compte est en attente d'approbation par un administrateur" |
| `account_blocked`                 | "Votre compte a ete bloque. Veuillez contacter un administrateur" |
| `error_communicating_with_google` | "Une erreur est survenue" (default fallback)                      |
| `invalid_state`                   | "Une erreur est survenue" (default fallback)                      |

Note: `signup_disabled` is defined in the enum but is not currently produced by `handleGoogleCallback`; it is
reserved for future use.

### 4.4 Session Cookies

| Cookie          | Helper            | Payload                  | maxAge                    | httpOnly | sameSite | secure (PROD) |
| --------------- | ----------------- | ------------------------ | ------------------------- | -------- | -------- | ------------- |
| `app-session`   | `useAppSession`   | `{ userId: string }`     | `60 * 60 * 24 * 30` (30d) | true     | lax      | true          |
| `oauth-session` | `useOAuthSession` | `{ oauthState: string }` | (session-scoped)          | true     | lax      | true          |

### 4.5 User Schema (`src/lib/db/schema/user.ts`)

```
sqliteTable('user', {
  email: text('email').notNull().unique(),
  id: text('id').primaryKey(),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  status: text('status', { enum: ['pending', 'active', 'blocked'] }).notNull().default('active'),
})
```

### 4.6 Required Environment

| Variable               | Source                     | Purpose                                                                  |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------ |
| `GOOGLE_CLIENT_ID`     | `cloudflare:workers` `env` | OAuth client identifier (sent to Google in initiation + token exchange). |
| `GOOGLE_CLIENT_SECRET` | `cloudflare:workers` `env` | OAuth client secret (sent in token exchange only).                       |
| `SESSION_SECRET`       | `cloudflare:workers` `env` | Password used by `useSession` to encrypt cookies.                        |
| `VITE_PUBLIC_URL`      | `import.meta.env`          | Public origin used to build the OAuth `redirect_uri`.                    |

### 4.7 Route Context Injected by Root

```
context: {
  authUser: User | undefined,
  isAdmin: boolean,
}
```

`/auth/login` consumes `context.authUser` in `beforeLoad` to redirect already-authenticated visitors away from the
login page.

## 5. Acceptance Criteria

### 5.1 Sign-In Initiation

- **AC-001** Given an unauthenticated user on `/auth/login`, when the user clicks "Connexion avec Google", then the
  browser is redirected to `https://accounts.google.com/o/oauth2/v2/auth` with `client_id`, `redirect_uri`,
  `response_type=code`, `scope=openid email profile`, `access_type=online`, `prompt=select_account`, and a `state`
  matching `/^[0-9a-f]{32}$/`, and the `oauth-session` cookie carries the same `state` as `oauthState`.

### 5.2 Successful Callback (Active User)

- **AC-002** Given `oauth-session.oauthState === <state>` and Google returns a valid `code`, when GET
  `/api/auth/google/callback?code=<code>&state=<state>` is requested, then the system exchanges the code, fetches
  userinfo, finds an existing user with `status === 'active'`, sets `app-session.userId = user.id`, and redirects to
  `/`.

### 5.3 New User (Pending Approval)

- **AC-003** Given a Google account whose email has no row in `user`, when the callback is processed, then a row is
  inserted with `id = userInfo.id`, `email = userInfo.email`, `role = 'user'`, `status = 'pending'`, no
  `app-session` is created, and the user is redirected to `/auth/login?error=account_pending`.

### 5.4 Pending User Re-attempt

- **AC-004** Given an existing user with `status === 'pending'`, when the callback is processed, then no
  `app-session` is set and the user is redirected to `/auth/login?error=account_pending`.

### 5.5 Blocked User

- **AC-005** Given an existing user with `status === 'blocked'`, when the callback is processed, then no
  `app-session` is set and the user is redirected to `/auth/login?error=account_blocked`.

### 5.6 CSRF / State Mismatch

- **AC-006** Given the request `state` does not equal `oauth-session.oauthState` (or `oauthState` is empty), when
  `handleGoogleCallback` runs, then the user is redirected to `/auth/login?error=invalid_state` and no token exchange
  occurs.

### 5.7 Google Communication Failure

- **AC-007** Given Google's token endpoint returns a non-OK response or a body without `access_token`, when the
  callback runs, then the user is redirected to `/auth/login?error=error_communicating_with_google`.
- **AC-008** Given `userinfo` returns non-OK or a body missing `id`, `email`, or `name`, when the callback runs, then
  the user is redirected to `/auth/login?error=error_communicating_with_google`.

### 5.8 Logout

- **AC-009** Given an authenticated user, when `logout` is invoked, then `app-session` is cleared and the function
  returns `{ success: true }`.

### 5.9 Auth Guard

- **AC-010** Given no `app-session`, when a server function wrapped by `authGuard()` is called, then it throws
  `redirect({ to: '/auth/login' })`.
- **AC-011** Given `user.status === 'blocked'`, when `authGuard()` runs, then it throws
  `redirect({ to: '/auth/login', search: { error: 'account_blocked' } })`.
- **AC-012** Given `user.status === 'pending'`, when `authGuard()` runs, then it throws
  `redirect({ to: '/auth/login', search: { error: 'account_pending' } })`.
- **AC-013** Given `user.role !== 'admin'`, when `authGuard('admin')` runs, then it throws `Error('Permission denied')`.
- **AC-014** Given `user.status === 'active'` (and `role === 'admin'` if required), when `authGuard(role?)` runs, then
  it forwards `{ context: { user } }` to the next handler.

### 5.10 DEV Bypass

- **AC-015** Given `import.meta.env.DEV === true`, when `getAuthUser` is invoked, then it returns
  `{ email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }` regardless of cookie state.

### 5.11 Login Page UX

- **AC-016** Given `/auth/login?error=account_pending`, when the page mounts, then a destructive toast is dispatched
  with message "Votre compte est en attente d'approbation par un administrateur".
- **AC-017** Given a user already in `context.authUser`, when navigating to `/auth/login`, then the route's
  `beforeLoad` throws `redirect({ to: '/' })`.

## 6. Test Automation Strategy

### 6.1 Test Levels

- **Unit** (Vitest via `vp test`):
  - `generateState` produces a 32-character hex string of distinct values across calls.
  - `getAuthUser` returns the DEV admin when `import.meta.env.DEV` is mocked true.
  - `getAuthUser` returns `undefined` when no `session.data.userId`.
  - `logout` calls `session.clear()` and returns `{ success: true }`.
  - `authGuard()` branches: no user, blocked, pending, role mismatch, admin success, user success.
- **Integration** (mocked `fetch` for Google endpoints + test D1):
  - `handleGoogleCallback`: missing code/state -> `invalid_state`.
  - `handleGoogleCallback`: state mismatch -> `invalid_state`.
  - `handleGoogleCallback`: token endpoint non-OK -> `error_communicating_with_google`.
  - `handleGoogleCallback`: userinfo missing fields -> `error_communicating_with_google`.
  - `handleGoogleCallback`: new email -> inserts pending row + `account_pending`.
  - `handleGoogleCallback`: pending row -> `account_pending`.
  - `handleGoogleCallback`: blocked row -> `account_blocked`.
  - `handleGoogleCallback`: active row -> `app-session.userId` set, returns user.
- **Route**: GET `/api/auth/google/callback` without `code`/`state` throws "Missing code or state".

### 6.2 Test Doubles

- Mock `cloudflare:workers` `env` with stub `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`.
- Mock `useSession` storage in-memory.
- Mock `global.fetch` for `oauth2.googleapis.com/token` and `googleapis.com/oauth2/v2/userinfo`.

### 6.3 CI Gates

- `vp check` (format + lint + types).
- `vp test` must pass for all auth-related suites.

### 6.4 Coverage Target

- Lines/branches >= 90% across `src/features/auth/api/*` and `src/features/auth/lib/auth-guard.ts`.

## 7. Rationale & Context

- **Google as sole IdP**: Reduces credential surface; no password storage, no email verification flow needed.
- **Admin-approval (`pending`) on first login**: This is a private/family app; new accounts must not gain access by
  merely possessing a Google account. The DB default of `active` is overridden by an explicit `'pending'` write in
  `handleGoogleCallback` so that the policy is enforced at the auth layer rather than depending on schema defaults.
- **Two cookies, one secret**: `oauth-session` carries only short-lived handshake state; `app-session` carries the
  durable `userId`. Splitting the cookies prevents OAuth handshake artifacts from leaking into the long-lived
  application session.
- **`state` via `useOAuthSession`** rather than a query-only round-trip ties the value to the user agent's cookie
  jar; an attacker triggering the callback in a victim's browser cannot forge the cookie-bound state.
- **DEV bypass** in `getAuthUser` allows local development without configuring a Google OAuth client. The bypass is
  gated by `import.meta.env.DEV` and stripped in production builds.
- **`access_type=online`**: The app does not need offline access to Google APIs; refresh tokens would expand the
  blast radius without benefit.
- **`prompt=select_account`**: Matches the multi-account expectation of household members sharing devices.
- **`authGuard` returns `{ context: { user } }`**: Downstream server functions receive a non-null user without
  needing a second DB query.

## 8. Dependencies & External Integrations

### 8.1 Internal

- `@/lib/db` (Drizzle + D1) for `user` queries and inserts.
- `@/lib/db/schema/user.ts` for the `user` table.
- `@/lib/session` for `useAppSession`, `useOAuthSession`.
- `@/utils/error-handler` for `withServerError`.
- `@/components/ui/*` for the login page UI (Button, Card, toastManager).
- Root route for injecting `authUser` and `isAdmin` into route context.

### 8.2 External

- `@tanstack/react-router` (`redirect`, `createFileRoute`).
- `@tanstack/react-start` (`createServerFn`, `createServerOnlyFn`, `createMiddleware`, `useServerFn`).
- `@tanstack/react-start/server` (`useSession`).
- `cloudflare:workers` (`env` for `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`).
- `zod` for `searchSchema` on `/auth/login`.
- Google OAuth 2.0:
  - Authorization endpoint: `https://accounts.google.com/o/oauth2/v2/auth`.
  - Token endpoint: `https://oauth2.googleapis.com/token`.
  - Userinfo endpoint: `https://www.googleapis.com/oauth2/v2/userinfo`.
- Cloudflare Workers runtime (Web Crypto `crypto.getRandomValues`, `fetch`).

## 9. Examples & Edge Cases

### 9.1 OAuth Authorization URL (REQ-001)

```
https://accounts.google.com/o/oauth2/v2/auth?
  access_type=online&
  client_id=<GOOGLE_CLIENT_ID>&
  prompt=select_account&
  redirect_uri=<VITE_PUBLIC_URL>/api/auth/google/callback&
  response_type=code&
  scope=openid+email+profile&
  state=<32-char-hex>
```

### 9.2 Token Exchange Request (REQ-004)

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

client_id=<...>&client_secret=<...>&code=<code>&grant_type=authorization_code&redirect_uri=<...>/api/auth/google/callback
```

### 9.3 New-User Insertion (REQ-006)

```
INSERT INTO user (id, email, role, status)
VALUES (<google_userinfo.id>, <google_userinfo.email>, 'user', 'pending')
```

Followed by `redirect('/auth/login?error=account_pending')`.

### 9.4 Login Page Search Schema (REQ-012)

```
const searchSchema = z.object({ error: z.string().optional() })
```

### 9.5 Edge Cases

- **State cookie missing entirely**: `oAuthSession.data.oauthState` is falsy -> `invalid_state`.
- **Two simultaneous OAuth attempts in the same browser**: The latter overwrites `oauth-session.oauthState`; the
  earlier callback fails with `invalid_state`. This is acceptable by design.
- **Email change at Google**: Lookup is by `email`. If a previously-linked Google account changes its primary email
  to a new value, no existing user matches and a new pending row is created. The original row is unaffected and
  remains active. Operators must reconcile manually via the users feature.
- **User row deleted while `app-session` is live**: `getAuthUser` returns `undefined`; `authGuard` redirects to
  `/auth/login`.
- **Userinfo returns `email_verified=false`**: Not currently checked. (Future hardening: reject unverified emails.)
- **`prompt=select_account` with single Google session**: Google still shows the account picker UI, which is
  acceptable.
- **DEV bypass in tests**: Tests that exercise the production path must run with `import.meta.env.DEV === false`.

## 10. Validation Criteria

- **VAL-001** All requirements in section 3.1 (REQ-001..014) and section 3.2 (SEC-001..008) have at least one
  acceptance criterion (section 5) and at least one automated test (section 6).
- **VAL-002** `vp check` passes (oxfmt + oxlint + tsc).
- **VAL-003** `vp test` passes for the auth suite.
- **VAL-004** Manual verification:
  1. New Google account -> redirected to `/auth/login?error=account_pending`; row exists with `status='pending'`.
  2. Admin promotes the user to `active` (see users feature) -> next sign-in lands on `/`.
  3. Admin sets the user to `blocked` -> sign-in attempt returns `account_blocked`.
  4. `logout` clears `app-session` and subsequent navigation to a guarded route redirects to `/auth/login`.
- **VAL-005** Production build includes neither `GOOGLE_CLIENT_SECRET` nor `SESSION_SECRET` in client bundles, and
  the DEV bypass branch in `getAuthUser` is not reachable.
- **VAL-006** Google OAuth client whitelists `${VITE_PUBLIC_URL}/api/auth/google/callback` exactly.
- **VAL-007** All cookies set by the auth flow have `HttpOnly` and `SameSite=Lax`; in production they also carry
  `Secure`.

## 11. Related Specifications / Further Reading

- [Architecture overview](../../docs/architecture.spec.md)
- [Server Functions infrastructure](../../docs/infrastructure/server-functions.spec.md)
- [Platform (Cloudflare Workers)](../../docs/infrastructure/platform.spec.md)
- [Users feature (admin approval, role/status mutations)](../users/users.spec.md)
- Google Identity OAuth 2.0 web server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- TanStack Start sessions: https://tanstack.com/start/latest/docs/framework/react/api/server/useSession
