---
title: Users (admin management)
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: [../auth/auth.spec.md]
---

## 2. Problem Statement

The auth feature (see `../auth/auth.spec.md`) enforces a `pending` → `active` → `blocked` lifecycle for user
accounts. This feature provides the **admin-facing** UI and server functions to drive that lifecycle:

- `[G-1]` Admins can see pending signups and approve them into active users.
- `[G-2]` Admins can block any active or pending user, revoking access.
- `[G-3]` Admins can create users manually (e.g., pre-provision a known collaborator's email + role) without
  waiting for them to sign in first.
- `[G-4]` Admins can assign the `admin` role at creation time (e.g., promote a second admin).
- `[G-5]` The UI makes "swipe to block" the primary mobile affordance — destructive actions feel intentional.

## 3. Key Design Decisions

| Decision                              | Choice                                                                | Rationale                                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Status-tabbed list           | Three tabs (Active / Pending / Blocked) driven by route search param  | Mirrors the state machine; each tab is a separate server query, filtered at the DB.                              |
| `[KD-2]` All mutations admin-only     | `authGuard('admin')` on `create`, `approve`, `block`                  | Destructive / privilege-changing operations must never be reachable from a non-admin UI.                         |
| `[KD-3]` Manual-created user ID       | `crypto.randomUUID()`                                                 | When admin pre-creates a user before first Google sign-in, no Google subject ID exists yet. See caveat `[C-1]`.  |
| `[KD-4]` No "delete user"             | Block is terminal, not a hard delete                                  | Preserves referential integrity with `recipe.created_by`; keeps audit trail.                                     |
| `[KD-5]` No "unblock" action          | Only approve (pending → active) and block (any → blocked) are exposed | Intentional friction for recovering blocked accounts — surface via manual DB edit until a real use case emerges. |
| `[KD-6]` Preload all three tab groups | Route loader fetches pending + active + blocked in parallel           | Makes tab switching instant; payload is tiny (user rows only contain id/email/role/status).                      |

## 4. Principles & Intents

- `[PI-1]` **Admin-only at the API** — role checks live on the server function, not in the UI. A malicious client
  bypassing the UI must still hit `authGuard('admin')`.
- `[PI-2]` **Destructive UI requires intent** — block is a swipe (mobile) or a confirmation click (desktop), never
  a one-tap action from a list.
- `[PI-3]` **Reuse the auth `user` table** — this feature has no schema of its own. All state lives in
  `src/lib/db/schema/user.ts`.
- `[PI-4]` **French-language UI copy** — all toasts and dialogs follow the app's French-by-default convention.

## 5. Non-Goals

- `[NG-1]` Hard delete of user rows.
- `[NG-2]` User profile editing (name, avatar, preferences) — auth uses Google profile data ephemerally and does not
  store it.
- `[NG-3]` Email invitations — manual create just inserts a row; the user must still sign in via Google to activate
  their session.
- `[NG-4]` Password reset / forgot-password flows (no passwords).
- `[NG-5]` Audit log of who-blocked-whom.

## 6. Caveats

- `[C-1]` Manual create assigns `crypto.randomUUID()` as the `user.id`. When that user later signs in with Google,
  the OAuth callback (see auth spec) finds the user by **email**, not by ID — but the pre-created ID does not get
  replaced by the Google subject ID. This is currently fine because nothing in the app pins identity to the Google
  subject ID specifically; `user.id` is just a stable PK. Be aware when integrating with any provider-specific API.
- `[C-2]` Manual create inserts with the default `status = 'active'` (DB default). An admin-created user does NOT
  go through the `pending` approval state.
- `[C-3]` If an admin blocks themselves, the next request hits `authGuard` and they are redirected to login. There
  is no confirmation guard against self-block.
- `[C-4]` `recipe.created_by` does not have a FK constraint to `user.id` (it's just a text column with default
  `'1'`). Blocking a user does not cascade to their recipes; existing recipes remain visible to others. This is
  by design (see auth non-goal `[NG-3]`).

## 7. High-Level Components

| Component           | Module type      | Responsibility                                                   | Public API surface                                |
| ------------------- | ---------------- | ---------------------------------------------------------------- | ------------------------------------------------- |
| Users list reader   | Server function  | Fetch users filtered by status (admin only)                      | `getUserListOptions(status)`                      |
| Create user         | Server function  | Insert a user with given email + role (admin only, UUID id)      | `createUserOptions()`                             |
| Approve user        | Server function  | `status: 'pending' → 'active'` (admin only)                      | `approveUserOptions()`                            |
| Block user          | Server function  | `status: * → 'blocked'` (admin only)                             | `blockUserOptions()`                              |
| User form           | React component  | Email + role field group (via `withFieldGroup`)                  | `<UserForm />`                                    |
| Add/Approve/Block   | React components | Dialog / button wrappers around the mutations                    | `<AddUser />`, `<ApproveUser />`, `<BlockUser />` |
| Users settings page | Route            | Tabbed UI (Active / Pending / Blocked) with the above components | `GET /settings/users` (admin only)                |

## 8. Detailed Design

| Component        | Entry point                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| List reader      | `src/features/users/api/get-all.ts` → `getUserListOptions`, `getUsersList`    |
| Create           | `src/features/users/api/create.ts` → `createUserOptions`, `userSchema`        |
| Approve          | `src/features/users/api/approve.ts` → `approveUserOptions`                    |
| Block            | `src/features/users/api/block.ts` → `blockUserOptions`                        |
| Form field group | `src/features/users/components/user-form.tsx`                                 |
| Add dialog       | `src/features/users/components/add-user.tsx`                                  |
| Approve dialog   | `src/features/users/components/approve-user.tsx`                              |
| Block (swipe)    | `src/features/users/components/block-user.tsx`                                |
| Settings route   | `src/routes/settings/users.tsx` — uses `authGuard('admin')` in `beforeLoad`   |
| DB schema        | `src/lib/db/schema/user.ts` (shared with auth feature)                        |
| Query keys       | `src/lib/query-keys.ts` → `queryKeys.allUsers`, `queryKeys.listUsers(status)` |

Validation rules in `userSchema`:

- `email`: valid email format (Zod `z.email()`).
- `role`: `'user' | 'admin'`.
- Create does NOT accept `status` (defaults to `active` in the DB).

## 9. Verification Criteria

- `[VC-1]` `/settings/users` redirects non-admin users (any status) via `authGuard('admin')`.
- `[VC-2]` `getUserListOptions('pending')` returns only users with `status='pending'`, ordered by email ASC.
- `[VC-3]` `approveUserOptions` mutates `status` from `pending` (or any) to `active`; on success,
  `queryKeys.allUsers` is invalidated so all three tabs refetch.
- `[VC-4]` `blockUserOptions` mutates any user's `status` to `blocked`.
- `[VC-5]` `createUserOptions` inserts a row with `id = <uuid>`, the given email, role, and default
  `status='active'`.
- `[VC-6]` `userSchema` rejects invalid emails and unknown roles.
- `[VC-7]` Attempting any of these server functions as a non-admin active user throws `Permission denied`.
- `[VC-8]` Mobile swipe-to-block on `<BlockUser />` fires the mutation only after the swipe threshold; desktop
  surfaces a confirmation button instead.
- `[VC-9]` Success / failure toasts are in French and include the affected user's email when available.
- `[VC-10]` Lint + typecheck pass: `pnpm lint`, `pnpm typecheck`.

## 10. Open Questions

- `[OQ-1]` Should we add an "Unblock" action and allow blocked → active transitions in the UI? Today admins must
  edit the DB directly.
- `[OQ-2]` Should manual-created users start in `pending` rather than `active`, so the Google first-sign-in still
  surfaces them to admins for review?
- `[OQ-3]` Should self-block be guarded by "are you sure you want to lock yourself out?" confirmation?
