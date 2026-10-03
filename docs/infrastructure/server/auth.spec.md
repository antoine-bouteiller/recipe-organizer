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

| Decision                      | Choice                                                                                              | Rationale                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `[KD-1]` Identity framework   | Void auth (Better Auth) drives Google OAuth, session issuance, and `/api/auth/*`.                   | OAuth state, PKCE, and cookie protocol stay in a maintained identity boundary.            |
| `[KD-2]` Account admission    | Google-created accounts have `pending` status; only `active` accounts receive a session.            | OAuth proves identity but does not establish group membership.                            |
| `[KD-3]` Authorization shape  | `withAuthGuard(handler, role?)` resolves a user before a protected Void handler and its validators. | Routes obtain a consistent status and role decision before their body executes.           |
| `[KD-4]` Session construction | Root `auth.ts` customizes Void's per-request Better Auth instance on D1.                            | Void owns wiring and session resolution; the app owns policy, secrets, and table mapping. |
| `[KD-5]` Login feedback       | Login consumes authorization failure codes and displays French messages.                            | A rejected member receives an actionable explanation without exposing server internals.   |

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
- `[C-3]` Void uses the request origin as `baseURL`, so every serving origin must be an authorized
  Google redirect origin (`/api/auth/callback/google`).
- `[C-5]` Drizzle-kit owns the auth tables while Void's generated adapter schema reads them; column
  names and millisecond timestamps must stay aligned with the `auth.ts` field mappings.
- `[C-4]` Role checks authorize a capability; handlers still perform row-ownership checks where a
  resource belongs to a user.

## 7. High-Level Components

| Component                 | Module type                 | Responsibility                                               | Public API surface                                           |
| ------------------------- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Auth config               | Root `auth.ts`              | Customize Void auth with secrets, Google, and table mappings | `defineAuth(...)`                                            |
| Membership hooks          | Auth configuration          | Set pending accounts and reject inactive sessions            | `databaseHooks`                                              |
| Auth user resolver        | Server helper               | Map Void's request user or development identity              | `getApiUser()`                                               |
| Guard wrapper             | Handler wrapper / page gate | Enforce presence, status, and optional role                  | `withAuthGuard(handler, role?)`, `guardPage(context, role?)` |
| Browser client and routes | Client library and routes   | Start sign-in, sign out, surface login outcomes              | `auth` (`void/client`), `/auth/login`, `/api/auth/*`         |

## 8. Detailed Design

### 8.1 Auth configuration and secrets

Void enables auth because the root `auth.ts` exports `defineAuth(({ defaults, env }) => ...)`. Void
creates Better Auth per request on the `DB` D1 binding through its generated Drizzle schema
(`.void/better-auth-schema.ts`). `auth.ts` extends `defaults`: it disables email/password, uses
`SESSION_SECRET` as the secret, configures Google from `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`,
and maps every Better Auth field onto the existing snake_case columns. Void also imports `auth.ts`
in Node to derive that schema, so it imports only packages and reads secrets from `env`.

Drizzle-kit migrations own the tables (`src/db/schema/{user,auth}.ts`); auth dates use
`timestamp_ms` to match Void's generated schema. Local dev additionally lets Void add auth indexes.

### 8.2 Account and session admission

The user-create hook sets every Google-created account to `pending`
(`auth.ts`). Before session creation, the session hook loads the user through Better Auth's internal
adapter and rejects `blocked` or `pending` statuses with `account_blocked` or `account_pending`.
Additional `role` and `status` fields have `input: false`, so client-facing auth calls cannot
provide them.

### 8.3 User resolution and guard

`getApiUser()` resolves a fixed active admin identity in development. In production it maps
`getUser()` from `void/auth`, which Void's auth middleware resolved once for the request before
app middleware; Void also appends refreshed or expired session cookies to the response.

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

Void mounts `/api/auth/*` and delegates it to the per-request Better Auth handler. Request bodies,
cookies, raw `Response` headers, and redirects pass through unchanged; app CSRF middleware skips
this prefix because Better Auth applies its own origin checks. Better Auth owns the OAuth redirect, callback, state, PKCE,
provider exchange, and session protocol. Application Void routes never construct OAuth state or
session cookies directly.

### 8.5 Login and sign-out contract

The regular login page in `pages/(app)/auth/login/index.tsx` starts
`auth.signIn.social` (`void/client`) with provider `google`, callback `/`, and error callback `/auth/login`.
It displays French messages for pending, blocked, or unverified-email codes and a generic fallback.
Its server loader redirects any resolved identity to `/`; otherwise it passes the error query prop.
Account sign-out calls `auth.signOut()` then uses `location.assign('/auth/login')`.
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
that protected functions would otherwise resolve (`auth.ts`).

Session cookies are Better Auth response state. Void's auth middleware calls `getSession` once per
request and appends each returned `Set-Cookie` header, including refreshed or expired session
cookies, to the response. Application code does not parse or encrypt session cookies. This refines architecture
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
always reads Void auth, so a deployed request has no synthetic identity path.

Tests can exercise status and role branches by supplying controlled resolver results. End-to-end
provider verification remains dependent on configured Google credentials and callback origin.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                                | Sections affected            | Reason                                                            |
| ---------- | ---------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| 2026-09-13 | Mount Better Auth through Hono with a shared request-scoped Drizzle client.              | 7, 8.1, 8.4                  | Preserve the auth contract while introducing the shared HTTP API. |
| 2026-09-13 | Move session resolution and protected actions to Hono RPC.                               | 3, 4, 7, 8.3, 8.6, 8.8, 8.10 | Preserve membership policy across the migrated transport.         |
| 2026-09-13 | Remove the Start cookie adapter from the Worker boundary.                                | 8.1, 8.4, 8.7                | Preserve Better Auth raw response cookies in the direct handler.  |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries.   | Updated contracts            | Reflect the completed page migration.                             |
| 2026-10-03 | Replace the custom Better Auth factory and route with Void auth configured by `auth.ts`. | 3, 6, 7, 8.1-8.5, 8.7, 8.10  | Let Void own auth wiring while keeping membership policy.         |
