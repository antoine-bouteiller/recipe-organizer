---
title: Authentication and Membership
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/server-functions.spec.md, docs/infrastructure/server/data-layer.spec.md]
---

## 2. Problem Statement

A private group needs Google sign-in without granting product access solely because a person has a
Google account. Authentication therefore establishes an encrypted session and membership policy
that keeps accounts pending until an administrator approves them. This leaf refines architecture
[KD-5], [KD-6], [G-3], and [C-6].

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                      | Choice                                                                                   | Rationale                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `[KD-1]` Identity framework   | Better Auth drives Google OAuth, session issuance, and its HTTP catch-all.               | OAuth state, PKCE, and cookie protocol stay in a maintained identity boundary.               |
| `[KD-2]` Account admission    | Google-created accounts have `pending` status; only `active` accounts receive a session. | OAuth proves identity but does not establish group membership.                               |
| `[KD-3]` Authorization shape  | `authGuard(role?)` resolves a user and injects it into protected Hono routes.            | Routes obtain a consistent status and role decision before their body executes.              |
| `[KD-4]` Session construction | `getAuth()` is a request-scoped factory using D1 and Worker secrets.                     | Worker bindings are request-scoped and sessions need the same persistence boundary as users. |
| `[KD-5]` Login feedback       | Login consumes authorization failure codes and displays French messages.                 | A rejected member receives an actionable explanation without exposing server internals.      |

## 4. Principles & Intents

- `[PI-1]` **Google proves identity, approval grants access** — refine architecture [KD-6]; provider
  identity is distinct from application membership.
- `[PI-2]` **Server-side secrets** — refine architecture [C-7]; OAuth credentials and session
  secret only enter server-side factory configuration.
- `[PI-3]` **Guard before effects** — refine server-functions [KD-2]; route context may inform UI,
  but protected Hono RPC repeats its authorization decision.

## 5. Non-Goals

- `[NG-1]` Password, magic-link, or alternate-provider authentication, refining architecture [NG-2].
- `[NG-2]` Automatic approval based on email domain or Google profile fields.
- `[NG-3]` Browser access to OAuth client secret or session secret.
- `[NG-4]` Auditing, rate limiting, or multi-factor authentication.

## 6. Caveats

- `[C-1]` Google callback availability and userinfo shape remain external dependencies, refining
  architecture [C-6].
- `[C-2]` The development branch returns a synthetic active admin (`src/lib/auth/get-auth-user.ts:34-41`),
  so it does not exercise provider callbacks.
- `[C-3]` `VITE_PUBLIC_URL` must resolve to an origin accepted by Google because Better Auth uses it
  as `baseURL` (`src/lib/auth/auth-server.ts:16-20`).
- `[C-4]` Role checks authorize a capability; handlers still perform row-ownership checks where a
  resource belongs to a user.

## 7. High-Level Components

| Component                 | Module type               | Responsibility                                     | Public API surface                         |
| ------------------------- | ------------------------- | -------------------------------------------------- | ------------------------------------------ |
| Auth factory              | Server library            | Configure Better Auth with D1, secrets, and Google | `getAuth()`                                |
| Membership hooks          | Auth configuration        | Set pending accounts and reject inactive sessions  | `databaseHooks`                            |
| Auth user resolver        | Hono session route        | Resolve session identity or development identity   | `GET /api/session`                         |
| Guard middleware          | Hono middleware           | Enforce presence, status, and optional role        | `authGuard(role?)`                         |
| Browser client and routes | Client library and routes | Start sign-in, sign out, surface login outcomes    | `authClient`, `/auth/login`, `/api/auth/*` |

## 8. Detailed Design

### 8.1 Auth factory and secrets

`getAuth(db = getDb())` creates Better Auth per request, connects the Drizzle adapter to that client,
and exposes the account, session, user, and verification schema (`src/lib/auth/auth-server.ts:1-18`).
The Hono request handler supplies its request-scoped database client. It uses
`SESSION_SECRET` as the auth secret and passes Google client credentials only in the social-provider
configuration (`src/lib/auth/auth-server.ts:45-51`). There is no TanStack Start cookies adapter:
Better Auth's raw `Response` cookie headers are returned unchanged by the Hono/Worker boundary.

### 8.2 Account and session admission

The user-create hook sets every Google-created account to `pending`
(`src/lib/auth/auth-server.ts:38-42`). Before session creation, the session hook loads the user and
rejects `blocked` or `pending` statuses with `account_blocked` or `account_pending`
(`src/lib/auth/auth-server.ts:21-36`). Additional `role` and `status` fields have `input: false`,
so client-facing auth calls cannot provide them (`src/lib/auth/auth-server.ts:52-57`).

### 8.3 User resolution and guard

`GET /api/session` returns the session identity or `null`; `getAuthUser()` consumes it through the
typed Hono client and converts `null` to `undefined` (`src/lib/auth/get-auth-user.ts:1-30`).
`getApiUser()` receives an explicit request-scoped development boolean, returning the bounded
synthetic identity only when it is true; other execution reads Better Auth session headers
(`src/lib/auth/api-user.ts:5-17`). `authGuard()` returns authorization failures or calls `next` with
the user context.

### 8.4 OAuth and HTTP route contract

The direct Worker Hono handler delegates GET and POST `/api/auth/*` requests to the per-request
Better Auth handler (`src/lib/api.ts:17`). Request bodies, cookies, raw `Response` headers, and
redirects pass through unchanged. Better Auth owns the OAuth redirect, callback, state, PKCE,
provider exchange, and session protocol. Application Hono routes never construct OAuth state or
session cookies directly.

### 8.5 Login and sign-out contract

The login action invokes `authClient.signIn.social` with provider `google`, callback `/`, and login
error callback (`src/routes/auth/login.tsx:13-18`). The login route maps pending and blocked codes
to French messages (`src/routes/auth/login.tsx:20-29`) and redirects an authenticated visitor away
from login (`src/routes/auth/login.tsx:59-65`). Browser sign-out uses `authClient.signOut()` from
an account UI; protected calls become anonymous once the session is absent.

### 8.6 Interaction boundary

Auth owns identity, membership status, and role. Hono feature routes consume `authGuard()` and
enforce resource ownership; the data layer owns storage mechanics; platform owns Worker secret provisioning.
This division refines the server umbrella dependency direction [KD-2].

### 8.7 Session semantics

A session represents an already-approved identity at the time the session hook runs. The hook checks
the persisted status before issuance, so a pending or blocked account does not receive the session
that protected functions would otherwise resolve (`src/lib/auth/auth-server.ts:21-36`).

Session cookies are Better Auth response state. The direct Worker preserves the raw `Response`
cookie headers. Hono session resolution calls `auth.api.getSession({ headers, returnHeaders: true })`
and appends each returned `Set-Cookie` header, including refreshed or expired session cookies, to
its response. Application code does not parse or encrypt session cookies. This refines architecture
[KD-5] and keeps cookie mechanics within the identity library.

### 8.8 Role and ownership boundary

`role` distinguishes administrative capability from ordinary membership. It does not make an
administrator the owner of every row at the data-layer level; feature routes explicitly decide where
an administrator may bypass ownership, as specified in the server-functions leaf.

`status` is an admission state rather than a UI-only label. Both session issuance and guard
execution interpret it, so a stale route screen cannot authorize a server mutation.

### 8.9 Error-code boundary

The account-pending and account-blocked codes are intentionally limited to login outcomes. They
carry enough information for a French explanation but do not disclose whether an unknown provider
identity exists in the application.

Other identity-provider failures use the generic login error path. The browser receives an
application message, while provider and server details remain in server-side diagnostic channels.

### 8.10 Development boundary

The development identity is a bounded local capability selected by the explicit `development` value
passed into the API request context (`src/lib/auth/api-user.ts:5-17`). Production session resolution
always calls Better Auth, so a deployed request has no synthetic identity path.

Tests can exercise status and role branches by supplying controlled resolver results. End-to-end
provider verification remains dependent on configured Google credentials and callback origin.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                   | Sections affected            | Reason                                                            |
| ---------- | --------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| 2026-09-13 | Mount Better Auth through Hono with a shared request-scoped Drizzle client. | 7, 8.1, 8.4                  | Preserve the auth contract while introducing the shared HTTP API. |
| 2026-09-13 | Move session resolution and protected actions to Hono RPC.                  | 3, 4, 7, 8.3, 8.6, 8.8, 8.10 | Preserve membership policy across the migrated transport.         |
| 2026-09-13 | Remove the Start cookie adapter from the Worker boundary.                   | 8.1, 8.4, 8.7                | Preserve Better Auth raw response cookies in the direct handler.  |
