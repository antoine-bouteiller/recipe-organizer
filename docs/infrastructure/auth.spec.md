---
title: Auth Specification
version: 2.1
date_created: 2026-05-08
last_updated: 2026-06-29
owner: recipe-organizer
tags: [infrastructure, auth, oauth, sessions, better-auth]
---

# Introduction

This document specifies the authentication feature of the recipe-organizer application. Authentication is
handled by [Better Auth](https://www.better-auth.com) configured with the Google social provider, the Drizzle
adapter over Cloudflare D1, and database-backed sessions. The feature retains the application-specific
admin-approval lifecycle (`pending` -> `active` / `blocked`) and the `user` / `admin` role model layered on top
of Better Auth via additional user fields and database hooks. It is implemented in `src/lib/auth/` and
integrated with the data layer (`db/schema/`) and the platform layer (Cloudflare Workers `env`).

## 1. Purpose & Scope

### 1.1 Purpose

Define the authoritative behavior, contracts, constraints, and acceptance criteria for:

- The Google sign-in flow handled by Better Auth (`authClient.signIn.social`).
- The user account lifecycle (`pending` -> `active` / `blocked`) gating access to the application.
- Session management via Better Auth (database-backed `session` table + signed session cookie).
- The `authGuard` server middleware that protects server functions.
- The login page (`/auth/login`) and the Better Auth catch-all API route (`/api/auth/$`).
- The development-mode bypass that returns a synthetic admin user.

### 1.2 In Scope

- Server instance factory: `getAuth()` (`src/lib/auth/auth-server.ts`).
- Browser client: `authClient` (`src/lib/auth/auth-client.ts`).
- Server function: `getAuthUser` (`src/lib/auth/get-auth-user.ts`).
- Middleware: `authGuard(role?)` (`src/lib/auth/auth-guard.ts`).
- Route handler: `/api/auth/$` (GET + POST) mounting `getAuth().handler`.
- Login page: `/auth/login`.
- Drizzle schema for Better Auth tables: `user`, `session`, `account`, `verification`.
- Required Cloudflare Workers env / Vite env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`,
  `VITE_PUBLIC_URL`.

### 1.3 Out of Scope

- User CRUD and role/status mutation by administrators (covered by `../users/users.spec.md`).
- Email/password authentication, magic links, MFA (not enabled).
- Refresh-token handling and long-lived offline access to Google APIs.
- Rate limiting, IP-based blocking, audit logging.
- Migration of pre-existing users from the legacy hand-rolled OAuth schema (explicitly not required; the
  `user` table is recreated with the Better Auth shape).

## 2. Definitions

| Term               | Definition                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Better Auth        | The authentication framework (`better-auth`) that owns sign-in, the OAuth handshake, session issuance, and cookie management. |
| `getAuth()`        | Per-request factory returning a configured Better Auth instance. Created per request because Workers `env` is request-scoped. |
| `authClient`       | Browser-side Better Auth client (`better-auth/react`) exposing `signIn.social`, `signOut`, etc.                               |
| Social sign-in     | `authClient.signIn.social({ provider: 'google', ... })` — initiates the Google authorization-code flow via Better Auth.       |
| Drizzle adapter    | `better-auth/adapters/drizzle` bridge so Better Auth reads/writes the app's Drizzle (D1/SQLite) tables.                       |
| `session` cookie   | Better Auth session cookie referencing a row in the `session` table. `httpOnly`, `sameSite=lax`, `secure` in production.      |
| `authGuard(role?)` | Server middleware (`createMiddleware({ type: 'function' })`) that loads the auth user and gates access by status/role.        |
| User status        | One of `pending`, `active`, `blocked`. Gates whether the user may access the app.                                             |
| User role          | One of `user`, `admin`. Used by `authGuard('admin')` to gate admin-only operations.                                           |
| Database hook      | A Better Auth `databaseHooks` callback. Used to default new users to `pending` and to deny sessions for non-`active` users.   |
| DEV bypass         | Conditional branch in `getAuthUser` that returns a synthetic admin user when `import.meta.env.DEV` is true.                   |
| Additional fields  | Custom columns (`role`, `status`) declared to Better Auth via `user.additionalFields` so they round-trip through the session. |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements (REQ)

- **REQ-001** The system SHALL expose Better Auth through a single catch-all route `/api/auth/$` whose `GET` and
  `POST` handlers delegate to `getAuth().handler(request)`. This serves all Better Auth endpoints, including the
  Google authorization redirect and the OAuth callback (`/api/auth/callback/google`).
- **REQ-002** `getAuth()` SHALL configure the Google social provider with `env.GOOGLE_CLIENT_ID` /
  `env.GOOGLE_CLIENT_SECRET`, set `baseURL` to `import.meta.env.VITE_PUBLIC_URL`, set `secret` to
  `env.SESSION_SECRET`, and use the Drizzle adapter (`provider: 'sqlite'`) over `getDb()`.
- **REQ-003** `getAuth()` SHALL register the `tanstackStartCookies()` plugin so Better Auth cookies set during
  server-function-initiated calls are attached to the TanStack Start response.
- **REQ-004** The login page (`/auth/login`) SHALL start sign-in via
  `authClient.signIn.social({ provider: 'google', callbackURL: '/', errorCallbackURL: '/auth/login' })`.
- **REQ-005** New users created through the Google flow SHALL be persisted with `status: 'pending'`. This is
  enforced by the `databaseHooks.user.create.before` hook, independent of the column default.
- **REQ-006** A session SHALL only be issued to users with `status === 'active'`. The
  `databaseHooks.session.create.before` hook SHALL look up the target user and, when the status is `blocked` or
  `pending`, throw `APIError('FORBIDDEN', { code })` with `code` of `account_blocked` / `account_pending`. Better
  Auth converts this into a redirect to `errorCallbackURL?error=<code>` (i.e. `/auth/login?error=...`).
- **REQ-007** `getAuthUser` SHALL be a `GET` server function wrapped by `withServerError`. When
  `import.meta.env.DEV` is true it SHALL return the synthetic admin user
  `{ email: 'admin@test.fr', id: 'string', role: 'admin', status: 'active' }`. Otherwise it SHALL read the Better
  Auth session via `getAuth().api.getSession({ headers: getRequest().headers })`, then load the full user row via
  `getDb().query.user.findFirst({ where: { id: session.user.id } })`, returning `undefined` when there is no
  session or no matching row.
- **REQ-008** Sign-out SHALL be performed client-side via `authClient.signOut()` (e.g. from `/settings/account`),
  followed by `router.invalidate()` to refresh route context.
- **REQ-009** `authGuard(role?)` SHALL load the auth user via `getAuthUser` and: redirect to `/auth/login` if no
  user; redirect to `/auth/login?error=account_blocked` if `status === 'blocked'`; redirect to
  `/auth/login?error=account_pending` if `status === 'pending'`; throw `Error('Permission denied')` if
  `role === 'admin'` AND `user.role !== 'admin'`. On success it SHALL forward `{ context: { user } }` to `next`.
- **REQ-010** The `/auth/login` route SHALL parse `?error=` via the Valibot schema
  `v.object({ error: v.optional(v.string()) })` and surface a localized error via `toastManager.add(...)`.
- **REQ-011** The `/auth/login` route's `beforeLoad` SHALL redirect authenticated users (`context.authUser`
  truthy) to `/`.
- **REQ-012** The root route SHALL inject `authUser` and `isAdmin` into the route context (via `getAuthUser`) so
  downstream routes can gate on them in `beforeLoad`.

### 3.2 Security Requirements (SEC)

- **SEC-001** The Better Auth session cookie SHALL be `httpOnly` and `sameSite=lax`, and SHALL be `secure` in
  production (Better Auth default behavior derived from `baseURL` / environment).
- **SEC-002** Sessions SHALL be signed using `env.SESSION_SECRET` (`secret` option). `SESSION_SECRET` MUST NOT be
  exposed to the client.
- **SEC-003** `GOOGLE_CLIENT_SECRET` and `SESSION_SECRET` SHALL only be read inside server-only code
  (`src/lib/auth/auth-server.ts` imports `cloudflare:workers`, which the bundler keeps server-side).
- **SEC-004** The OAuth `state`/PKCE handshake SHALL be managed entirely by Better Auth (stored in the
  `verification` table); the application SHALL NOT hand-roll CSRF state.
- **SEC-005** New users SHALL be created with `status: 'pending'` and SHALL NOT receive a session until promoted
  to `active` by an administrator (see `../users/users.spec.md`).
- **SEC-006** The DEV bypass in `getAuthUser` SHALL only execute when `import.meta.env.DEV` is true and MUST NOT
  ship in production builds.
- **SEC-007** `role` and `status` SHALL be declared with `input: false` so they cannot be set or escalated through
  Better Auth's client-facing APIs; they are mutated only by trusted server code (the users feature).

### 3.3 Constraints (CON)

- **CON-001** Runtime is Cloudflare Workers. All server code SHALL be compatible with the Workers runtime (Web
  Crypto, `fetch`, no Node-only APIs). `getAuth()` MUST be instantiated per request, not at module scope, because
  `env` and the D1 binding are only available within a request.
- **CON-002** The `user.id` column is `TEXT PRIMARY KEY` and is generated by Better Auth (not the Google subject
  id). Legacy rows keyed by Google id are not migrated.
- **CON-003** `role` is `text({ enum: ['user', 'admin'] })`, `notNull()`, default `'user'`. `status` is
  `text({ enum: ['pending', 'active', 'blocked'] })`, `notNull()`, default `'active'`. The `'active'` default
  applies to admin-provisioned rows (users feature); the Google flow overrides new sign-ups to `'pending'` via the
  user-create hook.
- **CON-004** The Drizzle table property keys for Better Auth tables MUST match Better Auth field names
  (`emailVerified`, `createdAt`, `updatedAt`, `expiresAt`, `userId`, `accountId`, `providerId`, ...) so the
  adapter can map them. SQL column names use snake_case.
- **CON-005** `VITE_PUBLIC_URL` SHALL be set so that `baseURL` resolves correctly. The Google OAuth client SHALL
  whitelist the redirect URI `${VITE_PUBLIC_URL}/api/auth/callback/google` (note: this differs from the legacy
  `/api/auth/google/callback`).
- **CON-006** `getAuthUser` is wrapped by `withServerError`; it MUST surface failures via that error envelope.
- **CON-007** `authGuard` is a function-type middleware (`createMiddleware({ type: 'function' })`) and MUST be
  applied to server functions, not as a route loader.

### 3.4 Guidelines (GUD)

- **GUD-001** Use `authClient.signIn.social(...)` from a client component to start sign-in; do not call Better
  Auth server APIs directly from client code.
- **GUD-002** Surface error codes only via the `?error=` query string on `/auth/login`. Unknown codes fall back
  to the generic "Une erreur est survenue" message.
- **GUD-003** Read the auth user from route context (`context.authUser`) where possible rather than calling
  `getAuthUser` ad-hoc inside components.
- **GUD-004** New protected server functions SHOULD compose `authGuard()` (or `authGuard('admin')`) instead of
  re-implementing user lookup.

### 3.5 Patterns (PAT)

- **PAT-001** Sign-in = `authClient.signIn.social` -> Better Auth redirect to Google -> `/api/auth/callback/google`
  -> Better Auth exchanges code, upserts user/account, runs hooks, issues session cookie -> redirect to
  `callbackURL`.
- **PAT-002** Lifecycle gating = `databaseHooks.user.create.before` forces `pending`; `session.create.before`
  throws `APIError` for `pending`/`blocked`, producing `/auth/login?error=<code>`.
- **PAT-003** Server session read = `getAuth().api.getSession({ headers: getRequest().headers })`.
- **PAT-004** Middleware composition: `createMiddleware({ type: 'function' }).server(async ({ next }) => { ... return next({ context: { user } }) })`.

## 4. Interfaces & Data Contracts

### 4.1 Auth Surface

| Name          | Kind                | File                            | Notes                                                  |
| ------------- | ------------------- | ------------------------------- | ------------------------------------------------------ |
| `getAuth`     | server factory      | `src/lib/auth/auth-server.ts`   | Returns a per-request Better Auth instance.            |
| `authClient`  | browser client      | `src/lib/auth/auth-client.ts`   | `createAuthClient` with `baseURL = VITE_PUBLIC_URL`.   |
| `getAuthUser` | GET server function | `src/lib/auth/get-auth-user.ts` | `Promise<User \| undefined>` (or DEV synthetic admin). |
| `authGuard`   | function middleware | `src/lib/auth/auth-guard.ts`    | `(role?: 'admin') => Middleware`.                      |

### 4.2 Routes

| Route         | Type           | File                        | Behavior                                                                           |
| ------------- | -------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| `/auth/login` | Page           | `src/routes/auth/login.tsx` | Renders sign-in card. Redirects to `/` if `context.authUser`. Validates `?error=`. |
| `/api/auth/$` | API (GET/POST) | `src/routes/api/auth/$.ts`  | Delegates every request to `getAuth().handler(request)`.                           |

### 4.3 Error Codes (login `?error=`)

Application-emitted codes (from the session hook):

| Code              | Message (FR)                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `account_pending` | "Votre compte est en attente d'approbation par un administrateur" |
| `account_blocked` | "Votre compte a été bloqué. Veuillez contacter un administrateur" |

Any other code (Better Auth's own OAuth error codes, e.g. `unable_to_get_user_info`) falls back to the generic
"Une erreur est survenue" message via `getErrorMessage`.

### 4.4 Better Auth Schema (`db/schema/`)

`user.ts` — Better Auth core user fields plus `role` / `status`:

```
sqliteTable('user', {
  createdAt, email (unique), emailVerified (boolean), id (pk),
  image, name, role ['user','admin'] default 'user',
  status ['pending','active','blocked'] default 'active', updatedAt,
})
```

`auth.ts` — `session`, `account`, `verification` tables matching Better Auth's contract (timestamps as
`integer({ mode: 'timestamp' })`, booleans as `integer({ mode: 'boolean' })`, `userId` FKs with
`ON DELETE CASCADE`).

### 4.5 Required Environment

| Variable               | Source                     | Purpose                                                        |
| ---------------------- | -------------------------- | -------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | `cloudflare:workers` `env` | Google OAuth client identifier.                                |
| `GOOGLE_CLIENT_SECRET` | `cloudflare:workers` `env` | Google OAuth client secret (server-only).                      |
| `SESSION_SECRET`       | `cloudflare:workers` `env` | Better Auth `secret` used to sign sessions.                    |
| `VITE_PUBLIC_URL`      | `import.meta.env`          | Public origin used as Better Auth `baseURL` (client + server). |

### 4.6 Route Context Injected by Root

```
context: {
  authUser: User | undefined,
  isAdmin: boolean,
}
```

## 5. Acceptance Criteria

- **AC-001** Clicking "Connexion avec Google" on `/auth/login` redirects the browser into Better Auth's Google
  authorization flow and ultimately to `/api/auth/callback/google`.
- **AC-002** An `active` user completing the Google flow receives a Better Auth session cookie and is redirected
  to `/`.
- **AC-003** A Google account with no existing `user` row is inserted with `status === 'pending'`, receives no
  session, and is redirected to `/auth/login?error=account_pending`.
- **AC-004** An existing `pending` user is redirected to `/auth/login?error=account_pending` with no session.
- **AC-005** An existing `blocked` user is redirected to `/auth/login?error=account_blocked` with no session.
- **AC-006** `authClient.signOut()` clears the session cookie; subsequent navigation to a guarded route or server
  function redirects to `/auth/login`.
- **AC-007** `authGuard()` redirects unauthenticated callers to `/auth/login`; `authGuard('admin')` throws
  `Error('Permission denied')` for non-admins and forwards `{ context: { user } }` for admins.
- **AC-008** With `import.meta.env.DEV === true`, `getAuthUser` returns the synthetic admin regardless of cookie
  state.
- **AC-009** `/auth/login?error=account_pending` dispatches a destructive toast with the pending message; a user
  already in `context.authUser` is redirected to `/` by `beforeLoad`.

## 6. Test Automation Strategy

- **Unit** (Vitest via `vp test`):
  - `getAuthUser` returns the DEV admin when `import.meta.env.DEV` is mocked true.
  - `authGuard()` branches: no user, blocked, pending, role mismatch, admin success, user success.
  - `assertOwnerOrAdmin` ownership checks (existing suite).
- **Integration** (mocked Better Auth + test D1):
  - `session.create.before` denies `pending` / `blocked` and allows `active`.
  - `user.create.before` defaults new users to `pending`.
- **CI Gates**: `vp check` (format + lint + types) and `vp test` MUST pass.

## 7. Rationale & Context

- **Better Auth over a hand-rolled flow**: Centralizes the OAuth handshake, PKCE/state, session storage, and
  cookie handling in a maintained library, removing bespoke token-exchange and CSRF code.
- **Drizzle adapter**: Keeps a single schema source of truth so Better Auth tables are migrated through the
  existing drizzle-kit pipeline and remain queryable via `getDb().query`.
- **Admin-approval (`pending`) preserved**: This is a private/family app; possessing a Google account must not
  grant access. The lifecycle is enforced with database hooks rather than schema defaults so the policy lives at
  the auth layer.
- **Per-request `getAuth()`**: Workers `env` and the D1 binding are request-scoped, so the instance cannot be a
  module singleton.
- **DEV bypass retained**: Allows local development without configuring a Google OAuth client; gated by
  `import.meta.env.DEV` and stripped from production builds.

## 8. Dependencies & External Integrations

### 8.1 Internal

- `@/lib/db` (Drizzle + D1) for the adapter and `user` lookups.
- `@schema` for `user`, `session`, `account`, `verification`.
- `@/utils/error-handler` for `withServerError`.
- `@/components/ui/*` for the login page UI.
- Root route for injecting `authUser` / `isAdmin`.

### 8.2 External

- `better-auth` (core, `better-auth/react`, `better-auth/adapters/drizzle`, `better-auth/api`,
  `better-auth/tanstack-start`).
- `@tanstack/react-router`, `@tanstack/react-start` (+ `/server` for `getRequest`).
- `cloudflare:workers` (`env`).
- Google OAuth 2.0 (authorization, token, and userinfo endpoints, driven by Better Auth).

## 9. Migration Notes

- The legacy hand-rolled modules were removed: `src/features/auth/api/google-auth.ts`,
  `src/features/auth/api/logout.ts`, `src/features/auth/api/constants.ts`, `src/lib/session.ts`, and the route
  `src/routes/api/auth/google/callback.ts`.
- The `user` table is recreated with the Better Auth shape (migration
  `db/migrations/20260628202100_better_auth`). Existing user rows are dropped — user migration is explicitly out of
  scope. The `recipes.created_by` column is unconstrained text and is unaffected by the recreate.
- Operators MUST update the Google OAuth client's authorized redirect URI to
  `${VITE_PUBLIC_URL}/api/auth/callback/google`.

## 10. Related Specifications / Further Reading

- [Architecture overview](../../docs/architecture.spec.md)
- [Server Functions infrastructure](../../docs/infrastructure/server-functions.spec.md)
- [Platform (Cloudflare Workers)](../../docs/infrastructure/platform.spec.md)
- [Users feature (admin approval, role/status mutations)](../users/users.spec.md)
- Better Auth docs: https://www.better-auth.com/docs
