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

| Decision                      | Choice                                                                                              | Rationale                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `[KD-1]` Identity framework   | Better Auth drives Google OAuth, session issuance, and its HTTP catch-all.                          | OAuth state, PKCE, and cookie protocol stay in a maintained identity boundary.               |
| `[KD-2]` Account admission    | Google-created accounts have `pending` status; only `active` accounts receive a session.            | OAuth proves identity but does not establish group membership.                               |
| `[KD-3]` Authorization shape  | `withAuthGuard(handler, role?)` resolves a user before a protected Void handler and its validators. | Routes obtain a consistent status and role decision before their body executes.              |
| `[KD-4]` Session construction | `getAuth()` is a request-scoped factory using D1 and Worker secrets.                                | Worker bindings are request-scoped and sessions need the same persistence boundary as users. |
| `[KD-5]` Login feedback       | Login consumes authorization failure codes and displays French messages.                            | A rejected member receives an actionable explanation without exposing server internals.      |

## 4. Principles & Intents

- `[PI-1]` **Google proves identity, approval grants access** — refine architecture [KD-6]; provider
  identity is distinct from application membership.
- `[PI-2]` **Server-side secrets** — refine architecture [C-7]; OAuth credentials and session
  secret only enter server-side factory configuration.
- `[PI-3]` **Guard before effects** — refine server-functions [KD-2]; shared page context may inform UI,
  but protected page actions and APIs repeat their authorization decision.

## 5. Non-Goals

- `[NG-1]` Password, magic-link, or alternate-provider authentication, refining architecture [NG-2].
- `[NG-2]` Automatic approval based on email domain or Google profile fields.
- `[NG-3]` Browser access to OAuth client secret or session secret.
- `[NG-4]` Auditing, rate limiting, or multi-factor authentication.

## 6. Caveats

- `[C-1]` Google callback availability and userinfo shape remain external dependencies, refining
  architecture [C-6].
- `[C-2]` The development branch returns a synthetic active admin (`src/lib/server/auth/api-user.ts`),
  so it does not exercise provider callbacks.
- `[C-3]` `VITE_PUBLIC_URL` must resolve to an origin accepted by Google because Better Auth uses it
  as `baseURL` (`src/lib/server/auth/auth-server.ts:16-20`).
- `[C-4]` Role checks authorize a capability; handlers still perform row-ownership checks where a
  resource belongs to a user.

## 7. High-Level Components

| Component                 | Module type                 | Responsibility                                                    | Public API surface                                           |
| ------------------------- | --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| Auth factory              | Server library              | Configure Better Auth with D1, secrets, and Google                | `getAuth()`                                                  |
| Membership hooks          | Auth configuration          | Set pending accounts and reject inactive sessions                 | `databaseHooks`                                              |
| Auth user resolver        | Server helper               | Resolve session identity once per request or development identity | `getApiUser(context)`                                        |
| Guard wrapper             | Handler wrapper / page gate | Enforce presence, status, and optional role                       | `withAuthGuard(handler, role?)`, `guardPage(context, role?)` |
| Browser client and routes | Client library and routes   | Start sign-in, sign out, surface login outcomes                   | `authClient`, `/auth/login`, `/api/auth/*`                   |

## 8. Detailed Design

### 8.1 Auth factory and secrets

`getAuth(db = getDb())` creates Better Auth per request, connects the Drizzle adapter to that client,
and exposes the account, session, user, and verification schema (`src/lib/server/auth/auth-server.ts:1-18`).
Void routes import the factory directly; its default argument obtains a request-scoped database client. It uses
`SESSION_SECRET` as the auth secret and passes Google client credentials only in the social-provider
configuration (`src/lib/server/auth/auth-server.ts:45-51`). There is no TanStack Start cookies adapter:
Better Auth's raw `Response` cookie headers are returned unchanged by the Void/Worker boundary.

### 8.2 Account and session admission

The user-create hook sets every Google-created account to `pending`
(`src/lib/server/auth/auth-server.ts:38-42`). Before session creation, the session hook loads the user and
rejects `blocked` or `pending` statuses with `account_blocked` or `account_pending`
(`src/lib/server/auth/auth-server.ts:21-36`). Additional `role` and `status` fields have `input: false`,
so client-facing auth calls cannot provide them (`src/lib/server/auth/auth-server.ts:52-57`).

### 8.3 User resolution and guard

`getApiUser(context)` resolves a fixed active admin identity in development. In production it calls
Better Auth `getSession({ headers, returnHeaders: true })`, returning identity or `undefined`,
and appends returned session cookies to `context.res`. A WeakMap memoizes the promise by raw Request
so page-context middleware and loaders share one session read; no standalone session API is needed.

`middleware/03.page-context.ts` sets `shared = { authUser: { email, role } | null, pathname }`
for non-API, non-file-extension paths. Shared identity controls affordances, not authorization.

`guardPage(context, role?)` returns an allowed user or a redirect Response: missing identity →
`/auth/login`; blocked/pending → login with the matching account error; non-admin when admin is
required → `/settings`. Protected loaders return that Response before reading their data.
Recipe create/edit actions also call the gate.

`withAuthGuard(handler, role?)` authorizes before handler validation and sets `apiUser`
(`user` is reserved by Void). It throws `HTTPException` for missing identity
(`401 unauthorized`), blocked/pending membership (`403 account_blocked` / `account_pending`),
or failed admin requirement (`403 Permission denied`). Settings actions, recipe deletion,
and inline ingredient API creation use this wrapper.

### 8.4 OAuth and HTTP route contract

`routes/api/auth/[...path].ts` exports GET and POST handlers that delegate
`/api/auth/*` to the per-request Better Auth handler; the app does not use `void/auth`. Request bodies, cookies, raw `Response` headers, and
redirects pass through unchanged. Better Auth owns the OAuth redirect, callback, state, PKCE,
provider exchange, and session protocol. Application Void routes never construct OAuth state or
session cookies directly.

### 8.5 Login and sign-out contract

The regular login page in `pages/(app)/auth/login/index.tsx` starts
`authClient.signIn.social` with provider `google`, callback `/`, and error callback `/auth/login`.
It displays French messages for pending, blocked, or unverified-email codes and a generic fallback.
Its server loader redirects any resolved identity to `/`; otherwise it passes the error query prop.
Account sign-out calls `authClient.signOut()` then uses `location.assign('/auth/login')`.
Protected calls become anonymous when the session is absent.

Browse loaders are not guarded: recipe list/search/details remain readable without identity;
creation/settings/editor pages require membership and users administration requires admin.
This is the shipped read-access boundary, distinct from private-group product intent.

### 8.6 Interaction boundary

Auth owns identity, membership status, and role. Void loaders/actions/API handlers consume `guardPage` or `withAuthGuard(handler, role?)` and
enforce resource ownership; the data layer owns storage mechanics; platform owns Worker secret provisioning.
This division refines the server umbrella dependency direction [KD-2].

### 8.7 Session semantics

A session represents an already-approved identity at the time the session hook runs. The hook checks
the persisted status before issuance, so a pending or blocked account does not receive the session
that protected functions would otherwise resolve (`src/lib/server/auth/auth-server.ts:21-36`).

Session cookies are Better Auth response state. The direct Worker preserves the raw `Response`
cookie headers. The request identity resolver calls `auth.api.getSession({ headers, returnHeaders: true })`
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

The development identity is a bounded local capability selected by `import.meta.env.DEV`
in `src/lib/server/auth/api-user.ts`. Production session resolution
always calls Better Auth, so a deployed request has no synthetic identity path.

Tests can exercise status and role branches by supplying controlled resolver results. End-to-end
provider verification remains dependent on configured Google credentials and callback origin.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                              | Sections affected            | Reason                                                            |
| ---------- | -------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| 2026-09-13 | Mount Better Auth through Hono with a shared request-scoped Drizzle client.            | 7, 8.1, 8.4                  | Preserve the auth contract while introducing the shared HTTP API. |
| 2026-09-13 | Move session resolution and protected actions to Hono RPC.                             | 3, 4, 7, 8.3, 8.6, 8.8, 8.10 | Preserve membership policy across the migrated transport.         |
| 2026-09-13 | Remove the Start cookie adapter from the Worker boundary.                              | 8.1, 8.4, 8.7                | Preserve Better Auth raw response cookies in the direct handler.  |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts            | Reflect the completed page migration.                             |
