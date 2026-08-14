---
title: Authentication and Membership
status: implemented
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
| `[KD-3]` Authorization shape  | `authGuard(role?)` resolves a user and injects it into protected server functions.       | Handlers obtain a consistent status and role decision before their body executes.            |
| `[KD-4]` Session construction | `getAuth()` is a request-scoped factory using D1 and Worker secrets.                     | Worker bindings are request-scoped and sessions need the same persistence boundary as users. |
| `[KD-5]` Login feedback       | Login consumes authorization failure codes and displays French messages.                 | A rejected member receives an actionable explanation without exposing server internals.      |

## 4. Principles & Intents

- `[PI-1]` **Google proves identity, approval grants access** — refine architecture [KD-6]; provider
  identity is distinct from application membership.
- `[PI-2]` **Server-side secrets** — refine architecture [C-7]; OAuth credentials and session
  secret only enter server-side factory configuration.
- `[PI-3]` **Guard before effects** — refine server-functions [KD-2]; route context may inform UI,
  but protected RPC repeats its authorization decision.

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
| Auth user resolver        | GET server function       | Resolve session identity or development identity   | `getAuthUser()`                            |
| Guard middleware          | Server middleware         | Enforce presence, status, and optional role        | `authGuard(role?)`                         |
| Browser client and routes | Client library and routes | Start sign-in, sign out, surface login outcomes    | `authClient`, `/auth/login`, `/api/auth/$` |

## 8. Detailed Design

### 8.1 Auth factory and secrets

`getAuth()` creates Better Auth per request, connects the Drizzle adapter to `getDb()`, and exposes
the account, session, user, and verification schema (`src/lib/auth/auth-server.ts:1-20`). It uses
`SESSION_SECRET` as the auth secret and passes Google client credentials only in the social-provider
configuration (`src/lib/auth/auth-server.ts:45-51`). The TanStack cookie plugin joins framework
responses to Better Auth cookie writes (`src/lib/auth/auth-server.ts:44-45`).

### 8.2 Account and session admission

The user-create hook sets every Google-created account to `pending`
(`src/lib/auth/auth-server.ts:38-42`). Before session creation, the session hook loads the user and
rejects `blocked` or `pending` statuses with `account_blocked` or `account_pending`
(`src/lib/auth/auth-server.ts:21-36`). Additional `role` and `status` fields have `input: false`,
so client-facing auth calls cannot provide them (`src/lib/auth/auth-server.ts:52-57`).

### 8.3 User resolution and guard

`getAuthUser()` is a GET server function. Development returns the bounded synthetic identity; other
execution reads the Better Auth session headers and returns its id, role, and status
(`src/lib/auth/get-auth-user.ts:33-51`). `authGuard()` redirects an absent user to login, redirects
inactive statuses with their error code, rejects a missing admin role, and otherwise calls `next`
with the user context (`src/lib/auth/auth-guard.ts:6-27`).

### 8.4 OAuth and HTTP route contract

The `/api/auth/$` file route delegates both GET and POST requests to the per-request Better Auth
handler (`src/routes/api/auth/$.ts:6-14`). Better Auth owns the OAuth redirect, callback, state,
PKCE, provider exchange, and session protocol. Application server functions never construct OAuth
state or session cookies directly.

### 8.5 Login and sign-out contract

The login action invokes `authClient.signIn.social` with provider `google`, callback `/`, and login
error callback (`src/routes/auth/login.tsx:13-18`). The login route maps pending and blocked codes
to French messages (`src/routes/auth/login.tsx:20-29`) and redirects an authenticated visitor away
from login (`src/routes/auth/login.tsx:59-65`). Browser sign-out uses `authClient.signOut()` from
an account UI; protected calls become anonymous once the session is absent.

### 8.6 Interaction boundary

Auth owns identity, membership status, and role. Server functions consume `authGuard()` and enforce
resource ownership; the data layer owns storage mechanics; platform owns Worker secret provisioning.
This division refines the server umbrella dependency direction [KD-2].

### 8.7 Session semantics

A session represents an already-approved identity at the time the session hook runs. The hook checks
the persisted status before issuance, so a pending or blocked account does not receive the session
that protected functions would otherwise resolve (`src/lib/auth/auth-server.ts:21-36`).

Session cookies are framework-managed response state. Application code obtains the session through
Better Auth and request headers, rather than parsing, encrypting, or setting a cookie directly.
This refines architecture [KD-5] and keeps cookie mechanics within the identity library.

### 8.8 Role and ownership boundary

`role` distinguishes administrative capability from ordinary membership. It does not make an
administrator the owner of every row at the data-layer level; server functions explicitly decide
where an administrator may bypass ownership, as specified in the server-functions leaf.

`status` is an admission state rather than a UI-only label. Both session issuance and guard
execution interpret it, so a stale route screen cannot authorize a server mutation.

### 8.9 Error-code boundary

The account-pending and account-blocked codes are intentionally limited to login outcomes. They
carry enough information for a French explanation but do not disclose whether an unknown provider
identity exists in the application.

Other identity-provider failures use the generic login error path. The browser receives an
application message, while provider and server details remain in server-side diagnostic channels.

### 8.10 Development boundary

The development identity is a bounded local capability selected only by `import.meta.env.DEV`
(`src/lib/auth/get-auth-user.ts:34-41`). Production session resolution always calls Better Auth,
so a deployed request has no synthetic identity path.

Tests can exercise status and role branches by supplying controlled resolver results. End-to-end
provider verification remains dependent on configured Google credentials and callback origin.

## 9. Open Questions

N/A
