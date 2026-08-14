---
title: User Administration
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
related: [docs/architecture.spec.md]
---

## 2. Problem Statement

A private recipe group needs an administrator-controlled membership directory: Google proves a
person's identity, while an administrator decides whether that person may access the product. The
user-administration screen gives administrators a focused way to list members by admission state,
create trusted accounts, approve pending accounts, and block access. This fulfils architecture [G-3]
and refines its identity and membership decisions [KD-5] and [KD-6].

- `[G-1]` Restrict every user-directory read and lifecycle transition to active administrators.
- `[G-2]` Make pending, active, and blocked membership states visible and actionable in one French interface.
- `[G-3]` Keep membership lists coherent when an administrative mutation succeeds.

## 3. Key Design Decisions

| Decision                         | Choice                                                                                        | Rationale                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Authorization           | Every user API composes `authGuard('admin')`; the route also redirects non-admin visitors.    | The Worker remains the enforcement boundary while the route avoids presenting an unavailable screen.                 |
| `[KD-2]` Membership model        | A user has `user` or `admin` role and `pending`, `active`, or `blocked` status.               | Role grants administrative capability; status expresses admission independently of capability.                       |
| `[KD-3]` Administrative creation | An administrator-created account receives a generated ID and the schema's active status.      | A pre-approved invitation path does not depend on an OAuth callback to establish membership.                         |
| `[KD-4]` Lifecycle actions       | Approve sets `active`; block sets `blocked`; no delete operation exists.                      | Reversible state transitions preserve an account's identity and allow an administrator to restore access.            |
| `[KD-5]` List coherence          | Successful mutations invalidate the users query-key family.                                   | A status transition moves a person between cached lists, so each status view must refresh from the Worker.           |
| `[KD-6]` Directory interaction   | The route preloads three status lists and presents them in swipeable tabs with shared search. | Administrators can inspect all admission states without a route change while retaining a compact mobile interaction. |

## 4. Principles & Intents

- `[PI-1]` **Approval grants membership** — refine architecture [KD-6]; provider identity alone does
  not grant an application session.
- `[PI-2]` **Guarded data access** — refine architecture [PI-3]; validation and persistence run
  behind the server authorization decision.
- `[PI-3]` **Status is operational** — session admission and administration interpret the same stored
  status rather than treating it as a display label.
- `[PI-4]` **French feedback at the feature boundary** — mutations communicate success and failure
  in the product language.

## 5. Non-Goals

- `[NG-1]` OAuth protocol handling, session-cookie construction, or provider credential storage;
  [authentication](../../../docs/infrastructure/server/auth.spec.md) owns those concerns.
- `[NG-2]` Passwords, email links, profile self-service, or identity providers other than Google.
- `[NG-3]` Account deletion, email notifications, background approval, or audit reporting.
- `[NG-4]` Allowing a browser-supplied ID, role, or status to bypass server policy.

## 6. Caveats

- `[C-1]` The development auth resolver supplies a synthetic active administrator, so provider
  callback behavior requires an environment with Google configuration, refining architecture [C-4].
- `[C-2]` A database uniqueness violation for an existing email reaches the server error boundary;
  the create mutation displays its localized error path.
- `[C-3]` Blocking an administrator, including the last administrator, is a permitted state
  transition; the directory does not impose a minimum-admin invariant.
- `[C-4]` A status update for an absent ID succeeds as an empty database update; the mutation still
  refreshes the relevant query family.

## 7. High-Level Components

```text
Administrator
   │ /settings/users
   v
route guard ──> status tabs + search ──> query options ──> admin server functions
                                                          │ guard → validate → D1
                                                          v
                                           invalidate users query family + French toast
```

| Component          | Module type              | Responsibility                                     | Public API surface                                   |
| ------------------ | ------------------------ | -------------------------------------------------- | ---------------------------------------------------- |
| User schema        | Drizzle schema           | Store identity, role, and admission status         | `user` table                                         |
| User APIs          | Feature server functions | List and transition user records                   | `getUserListOptions`, create, approve, block options |
| Guard              | Server middleware        | Require an active administrator                    | `authGuard('admin')`                                 |
| User form          | Feature form component   | Capture email and role for administrative creation | `UserForm`, `AddUser`                                |
| Lifecycle controls | Feature components       | Confirm blocking and initiate approval             | `ApproveUser`, `BlockUser`                           |
| Directory route    | File route               | Preload, filter, and partition lists by status     | `/settings/users`                                    |

## 8. Detailed Design

### 8.1 User and admission model

The `user` table has a text primary key, unique email, display name, Better Auth timestamps, role,
and status. Role defaults to `user`; status defaults to `active`
(`db/schema/user.ts:5-23`). Google account creation belongs to the authentication contract; its
account hook assigns `pending` as part of session admission
([auth specification](../../../docs/infrastructure/server/auth.spec.md#82-account-and-session-admission)).
An administrative create request accepts only email and role, generates `crypto.randomUUID()` on the
server, and supplies the required display name from the email
(`src/features/users/api/create.ts:13-26`).

| Status    | Meaning in this feature                            | Available lifecycle control |
| --------- | -------------------------------------------------- | --------------------------- |
| `pending` | Identity awaits administrator approval             | approve or block            |
| `active`  | Identity may access protected product functions    | block                       |
| `blocked` | Identity cannot access protected product functions | approve                     |

### 8.2 Server-function and authorization contract

The list API accepts a status, defaults it to `active`, orders results by email, and pairs the call
with `queryKeys.listUsers(status)` (`src/features/users/api/get-all.ts:10-31`). Create, approve, and
block validate their respective payloads and use the same `authGuard('admin')` middleware
(`src/features/users/api/create.ts:13-26`, `src/features/users/api/approve.ts:14-27`,
`src/features/users/api/block.ts:14-27`). The guard redirects anonymous, pending, and blocked
callers and rejects an active non-admin ahead of handler execution
(`src/lib/auth/auth-guard.ts:6-27`).

Approve writes `status: 'active'`; block writes `status: 'blocked'`. Their mutation options
invalidate `queryKeys.allUsers`; create invalidates the no-argument users-list prefix. Each option
also emits French success or error feedback (`src/features/users/api/create.ts:28-44`,
`src/features/users/api/approve.ts:29-43`, `src/features/users/api/block.ts:29-43`). This refines the
[server-functions](../../../docs/infrastructure/server/server-functions.spec.md) cache contract.

### 8.3 Directory route and search

The route redirects visitors whose route-context user lacks the admin role, prefetches active,
blocked, and pending query options, and renders three panels in `active`, `pending`, `blocked`
order (`src/routes/settings/users.tsx:86-98`). Each panel observes its own status query with
`useSuspenseQuery`, while a shared case-insensitive search matches email or role
(`src/routes/settings/users.tsx:22-31`). The tab labels are `Actifs`, `En attente`, and `Bloqués`.

`SwipeTabs` makes the panels available in one screen. Active rows expose blocking; pending rows
expose approval and blocking; blocked rows expose approval. Empty results distinguish an empty
status from a search with no match (`src/routes/settings/users.tsx:27-56`).

### 8.4 Administrative controls

`AddUser` validates against the shared user schema on dynamic form validation and at its
mutation boundary. A successful creation resets the form and closes its dialog
(`src/features/users/components/add-user.tsx:20-45`). The form offers French user and administrator
role labels (`src/features/users/components/user-form.tsx:7-32`). `ApproveUser` performs its mutation
within a React transition (`src/features/users/components/approve-user.tsx:14-29`). `BlockUser`
uses a confirmation dialog whose destructive action is labelled `Bloquer` and identifies the target
email (`src/features/users/components/block-user.tsx:17-29`).

The route-level redirect is a navigation affordance rather than the authorization mechanism. The
same API guard protects direct RPC invocation and performs the authoritative admission and role
decision. Cache refresh occurs only when that guarded write resolves, so each status tab resumes from
the persisted membership state.

## 9. Open Questions

N/A
