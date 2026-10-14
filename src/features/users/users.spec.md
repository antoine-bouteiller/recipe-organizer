---
title: User Administration
status: amended
author: Antoine Bouteiller
date: 2026-10-02
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

| Decision                         | Choice                                                                                                | Rationale                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Authorization           | The router applies an admin screen guard; every directory API uses `withAuthGuard(handler, 'admin')`. | The Worker remains the enforcement boundary while the route avoids presenting an unavailable screen.                 |
| `[KD-2]` Membership model        | A user has `user` or `admin` role and `pending`, `active`, or `blocked` status.                       | Role grants administrative capability; status expresses admission independently of capability.                       |
| `[KD-3]` Administrative creation | An administrator-created account receives a generated ID and the schema's active status.              | A pre-approved invitation path does not depend on an OAuth callback to establish membership.                         |
| `[KD-4]` Lifecycle actions       | Approve sets `active`; block sets `blocked`; no delete operation exists.                              | Reversible state transitions preserve an account's identity and allow an administrator to restore access.            |
| `[KD-5]` List coherence          | Successful create/approve/block mutations invalidate `allUsers`.                                      | A status transition moves a person between lists, so all panels receive the fresh persisted state.                   |
| `[KD-6]` Directory interaction   | The route preloads three status queries and presents them in hash-linked tabs with shared search.     | Administrators can inspect all admission states without a route change while retaining a compact mobile interaction. |

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
  invalidates the user queries.

## 7. High-Level Components

```text
Administrator
   │ /settings/users
   v
client admin guard ──> userList queries: active / pending / blocked ──> status tabs + search
                                                          │
                                      API mutations: admin guard → validate → D1
                                                          │
                                                allUsers invalidation → fresh panels
```

| Component          | Module type                    | Responsibility                                     | Public API surface                        |
| ------------------ | ------------------------------ | -------------------------------------------------- | ----------------------------------------- |
| User schema        | Drizzle schema                 | Store identity, role, and admission status         | `user` table                              |
| Directory boundary | Server query and API mutations | List and transition user records                   | `listUsers`, create/approve/block actions |
| Guard              | Server handler wrapper         | Require an active administrator                    | `withAuthGuard(handler, 'admin')`         |
| User form          | Feature form component         | Capture email and role for administrative creation | `UsersManagement` with app `createForm`   |
| Lifecycle controls | Feature components             | Confirm blocking and initiate approval             | `ApproveUser`, `BlockUser`                |
| Directory route    | File route                     | Preload, filter, and partition lists by status     | `/settings/users`                         |

## 8. Detailed Design

### 8.1 User and admission model

The `user` table has a text primary key, unique email, display name, Better Auth timestamps, role,
and status. Role defaults to `user`; status defaults to `active`
(`src/db/schema/user.ts`). Google account creation belongs to the authentication contract; its
account hook assigns `pending` as part of session admission
([auth specification](../../../docs/infrastructure/server/auth.spec.md#82-account-and-session-admission)).
An administrative create request accepts only email and role, generates `crypto.randomUUID()` on the
server, and supplies the required display name from the email
(`routes/api/users/index.ts`).

| Status    | Meaning in this feature                            | Available lifecycle control |
| --------- | -------------------------------------------------- | --------------------------- |
| `pending` | Identity awaits administrator approval             | approve or block            |
| `active`  | Identity may access protected product functions    | block                       |
| `blocked` | Identity cannot access protected product functions | approve                     |

### 8.2 Server-function and authorization contract

`listUsers(db, status)` orders results by email. `GET /api/users?status=active|pending|blocked`
requires admin and returns the list for that status. `src/pages/settings/users/index.svelte` is
registered with admin access and preloads all three `userList(status)` queries through
`queryClient.ensureQueryData`. Client redirects follow the auth leaf; API guards independently
reject unauthorized reads/writes before validation or persistence.

`POST /api/users` accepts `userSchema` (`{ email, role }`), generates the ID and uses the active
schema default. `PATCH /api/users/<id>` accepts `{ status: 'active' | 'blocked' }` for
approval/blocking. Both return empty responses and use `withAuthGuard(handler, 'admin')`.
Invalid bodies return `400 { error, errors }` with dotted field paths.
Feature `client/api/<operation>.ts` options use `readResponse(fetch(...))` from `void/client`;
create/approve/block mutation `onSuccess` invalidates `allUsers`, refreshing every status panel.

### 8.3 Directory route and search

The screen passes query-backed lists into `UsersManagement`, which renders panels in `active`,
`pending`, `blocked` order with hash anchors. A shared case-insensitive search matches email or role
(`src/features/users/client/components/users-management.svelte`). The tab labels remain `Actifs`, `En attente`,
and `Bloqués`.

`Tabs` makes the panels available in one screen. Active rows expose blocking; pending rows
expose approval and blocking; blocked rows expose approval. Empty results distinguish an empty
status from a search with no match.

### 8.4 Administrative controls

`UsersManagement` uses app-owned `createForm` with server-only validation through the create
mutation. A successful creation calls `reset()` with empty email/default role and closes the dialog;
field validation failures preserve editable values, while other failures use French alerts.
The existing French user/administrator labels remain. ApproveUser and confirmation dialogs track
pending while awaiting their mutations. BlockUser identifies the target email and retains `Bloquer`
as its confirmation action.

Client guards choose screens, not authorization. Callers await guarded writes and key invalidation
before closing/resetting; status panels observe persisted membership without a full reload.

## Outcome and acceptance

- `[SO-1]` Only active administrators can read the directory or perform lifecycle mutations.
  `[VC-1]` Anonymous/non-admin client routes redirect appropriately; direct unauthorized API requests fail
  before touching data. An administrator receives all three preloaded status queries.
- `[SO-2]` Status lists refresh together after mutations invalidate `allUsers`.
  `[VC-2]` Create a throwaway email, block it, then approve it from the blocked panel: it moves to the
  expected status panel after each mutation without a full reload.
- `[SO-3]` Existing French search, validation and dialog behavior remains available.
  `[VC-3]` Server validation rejects invalid email and preserves the draft; successful creation closes/resets the form; email/role
  search filters every tab and confirmation identifies the user being blocked.

## 9. Open Questions

N/A
