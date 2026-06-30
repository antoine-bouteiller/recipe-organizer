---
title: Users Feature Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, users, admin, rbac]
---

# Introduction

This specification defines the **users** feature of `recipe-organizer`: an
admin-only management surface for the application's user directory. It allows
administrators to list, create, approve, and block users from the
`/settings/users` route. The feature complements the OAuth sign-in flow defined
in the auth feature: a Google sign-in produces a `pending` user record that an
admin must approve before the user can authenticate.

## 1. Purpose & Scope

### 1.1 Purpose

Provide a deterministic, auditable contract for managing the lifecycle of a
`user` row in the application database, exposed through admin-only TanStack
Start server functions and a single React route under
`/settings/users`.

### 1.2 In scope

- `user` SQLite table schema (`src/lib/db/schema/user.ts`).
- Server functions in `src/features/users/api/`: `getUsersList`, `createUser`,
  `approveUser`, `blockUser`.
- React Query options exposed by those modules
  (`getUserListOptions`, `createUserOptions`, `approveUserOptions`,
  `blockUserOptions`).
- React components in `src/features/users/components/`: `UserForm`, `AddUser`,
  `ApproveUser`, `BlockUser`.
- The route file `src/routes/settings/users.tsx` (tabs, search,
  desktop/mobile UX).
- RBAC enforcement through `authGuard('admin')` on every server function.

### 1.3 Out of scope

- OAuth sign-in, session creation, and the redirects that produce
  `pending`/`blocked` states (see `../auth/auth.spec.md`).
- User self-service profile editing.
- Account deletion (no `deleteUser` server function exists).
- Password storage or credential management (the app uses OAuth only).

### 1.4 Audience

Engineers and LLM coding agents working on the recipe-organizer codebase.

## 2. Definitions

| Term                              | Definition                                                                                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User entity**                   | A row in the `user` SQLite table with columns `id`, `email`, `role`, `status`.                                                                                                                                                      |
| **Admin**                         | A `user` row whose `role = 'admin'`. Required by `authGuard('admin')`.                                                                                                                                                              |
| **Pending user**                  | A `user` row whose `status = 'pending'`. Created automatically by the OAuth sign-in flow when an unknown email signs in; cannot authenticate until approved.                                                                        |
| **Active user**                   | A `user` row whose `status = 'active'`. Default for admin-created records and for approved users. Allowed to authenticate.                                                                                                          |
| **Blocked user**                  | A `user` row whose `status = 'blocked'`. Cannot authenticate (the auth guard redirects to login with `error=account_blocked`).                                                                                                      |
| **`authGuard(role?)`**            | Server middleware in `src/lib/auth/auth-guard.ts` that resolves the current user, redirects unauthenticated/blocked/pending users, and throws `new Error('Permission denied')` when `role === 'admin'` and the caller is not admin. |
| **Server function**               | TanStack Start `createServerFn(...)` callable that runs only on the server.                                                                                                                                                         |
| **`queryKeys.allUsers`**          | Root React Query key for user lists. Invalidated after every mutation.                                                                                                                                                              |
| **`queryKeys.listUsers(status)`** | Per-status React Query key produced by `getUserListOptions`.                                                                                                                                                                        |
| **`SWIPE_THRESHOLD`**             | Constant `-100` (px) in `src/routes/settings/users.tsx` that triggers the mobile block confirmation when the row is dragged left past it.                                                                                           |
| **`DeleteDialog`**                | Generic confirm dialog component reused by `BlockUser` with a custom action label and icon.                                                                                                                                         |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional requirements

- **REQ-001** The `user` table MUST have schema:

  ```ts
  export const user = sqliteTable('user', {
    email: text('email').notNull().unique(),
    id: text('id').primaryKey(),
    role: text('role', { enum: ['user', 'admin'] })
      .notNull()
      .default('user'),
    status: text('status', { enum: ['pending', 'active', 'blocked'] })
      .notNull()
      .default('active'),
  })
  ```

- **REQ-002** `id` MUST be a string primary key. For OAuth users it MUST be the
  Google user id (set by the auth feature); for admin-created users it MUST be
  generated with `crypto.randomUUID()` inside `createUser`.
- **REQ-003** `email` MUST be globally unique (database-enforced).
- **REQ-004** `getUsersList` MUST return all users matching the requested
  status, ordered by `email` ascending. Default status is `'active'`.
- **REQ-005** `createUser` MUST insert a row with the provided `email` and
  `role`, a freshly generated UUID `id`, and rely on the column default for
  `status` (`'active'`). It MUST bypass the OAuth `pending` flow.
- **REQ-006** `approveUser` MUST update the targeted user's `status` to
  `'active'` and not modify any other column.
- **REQ-007** `blockUser` MUST update the targeted user's `status` to
  `'blocked'` and not modify any other column.
- **REQ-008** Each mutation (`createUser`, `approveUser`, `blockUser`) MUST,
  on success, invalidate the `queryKeys.allUsers` query subtree
  (`createUser` calls `invalidateQueries({ queryKey: queryKeys.listUsers() })`
  with no arg, which targets the same root key).
- **REQ-009** Each mutation MUST display a localized success toast on
  success and a `toastError` notification on failure.
- **REQ-010** The route `/settings/users` MUST preload all three lists
  (`active`, `pending`, `blocked`) in its loader via
  `context.queryClient.ensureQueryData(getUserListOptions(status))`.
- **REQ-011** The route MUST render three tabs in this order with these
  French labels: `Actifs` (active), `En attente` (pending), `Bloqués`
  (blocked). Default selected tab is `active`.
- **REQ-012** The route MUST provide a search input that filters the
  visible list by case-insensitive substring match on `email` OR `role`.
- **REQ-013** When viewport is mobile (`useIsMobile()` returns `true`) AND
  the current tab is `active` or `pending`, each row MUST be wrapped in
  `SwipeToBlock`. Dragging a row left past `SWIPE_THRESHOLD = -100`
  releases the drag, animates the row back to `x = 0`, and opens the
  `BlockUser` confirm dialog.
- **REQ-014** When viewport is desktop AND the current tab is `active` or
  `pending`, each row MUST display an explicit `BlockUser` button
  (`variant="destructive-outline"`).
- **REQ-015** When the current tab is `blocked` or `pending`, each row
  MUST display an `ApproveUser` button.
- **REQ-016** The "Add user" `AddUser` dialog MUST validate input
  with the shared `userSchema` and submit through `createUserOptions`,
  resetting the form and closing the dialog on success.
- **REQ-017** The `BlockUser` confirm dialog MUST use `DeleteDialog` with
  `actionLabel="Bloquer"`, `icon={ProhibitIcon}`, and a description of the
  form `Êtes-vous sûr de vouloir bloquer l'utilisateur ${userEmail} ?`.

### 3.2 Security requirements

- **SEC-001** Every server function in this feature MUST attach
  `.middleware([authGuard('admin')])`. This is non-negotiable: it is the only
  authorization barrier between unauthenticated callers and the user table.
- **SEC-002** `authGuard('admin')` MUST throw `new Error('Permission denied')`
  for non-admin authenticated users. Unauthenticated, blocked, or pending
  callers MUST be redirected to `/auth/login` (with `error=account_blocked`
  or `error=account_pending` where applicable) before role checks run.
- **SEC-003** The `/settings/users` entry point in the settings UI MUST only
  be rendered when the route context exposes `isAdmin === true`. The link
  MUST NOT be exposed to non-admin users (defense in depth on top of
  SEC-001).
- **SEC-004** Inputs to every server function MUST be validated server-side
  with the Zod schema declared in the same file
  (`getUsersListSchema`, `userSchema`, `approveUserSchema`,
  `blockUserSchema`). Client-side validation MUST NOT be the sole gate.
- **SEC-005** `createUser` MUST NOT accept `id` or `status` from the client.
  The `id` is generated server-side with `crypto.randomUUID()`; `status`
  defaults from the schema.

### 3.3 Constraints

- **CON-001** The feature targets Cloudflare Workers + Drizzle ORM over D1.
  All DB calls go through `getDb()` from `@/lib/db`.
- **CON-002** Server function input shapes are immutable contracts (clients
  rely on them). Schemas in source MUST stay in sync with this spec.
- **CON-003** UI strings MUST stay in French to match the rest of the
  application.
- **CON-004** No background jobs, no email notifications: approval is a
  synchronous DB write only.
- **CON-005** The feature MUST NOT introduce a `deleteUser` server function;
  the only state transitions are `pending -> active` and `* -> blocked`.

### 3.4 Guidelines

- **GUD-001** Co-locate server functions and their React Query
  `*Options` factories in the same file under
  `src/features/users/api/`.
- **GUD-002** Prefer `useSuspenseQuery(getUserListOptions(status))` inside a
  `<React.Suspense>` boundary to keep loading states declarative.
- **GUD-003** Wrap the optimistic UI side effects (form reset, dialog close)
  in the mutation's per-call `onSuccess` callback rather than inside
  `*Options` so reusable options remain side-effect free.
- **GUD-004** Use `useTransition` around approve calls (as `ApproveUser`
  does) to keep the icon button responsive while the mutation runs.

### 3.5 Patterns

- **PAT-001** Server-function shape:

  ```ts
  const approveUser = createServerFn()
    .middleware([authGuard('admin')])
    .validator(approveUserSchema)
    .handler(async ({ data }) => {
      /* ... */
    })
  ```

- **PAT-002** Mutation options factory exporting both `mutationFn` and
  paired `onSuccess`/`onError` toasts plus a single
  `invalidateQueries({ queryKey: queryKeys.allUsers })` (or
  `queryKeys.listUsers()` for the no-arg root form used by `createUser`).
- **PAT-003** TanStack Form usage:

  ```ts
  useAppForm({
    defaultValues: userDefaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: userSchema },
    onSubmit: async ({ value }) => {
      /* ... */
    },
  })
  ```

- **PAT-004** Mobile destructive action via `SwipeToBlock`: `motion.div`
  with `drag="x"`, `dragConstraints={{ left: -150, right: 0 }}`,
  `dragElastic={0.1}`, threshold `-100`.

## 4. Interfaces & Data Contracts

### 4.1 Database schema (`src/lib/db/schema/user.ts`)

| Column   | Type        | Constraints                                           | Default              |
| -------- | ----------- | ----------------------------------------------------- | -------------------- |
| `id`     | `text`      | `primaryKey()`                                        | none (set by caller) |
| `email`  | `text`      | `notNull()`, `unique()`                               | none                 |
| `role`   | `text` enum | `notNull()`, `enum: ['user', 'admin']`                | `'user'`             |
| `status` | `text` enum | `notNull()`, `enum: ['pending', 'active', 'blocked']` | `'active'`           |

### 4.2 Zod schemas

```ts
// src/features/users/api/get-all.ts
const getUsersListSchema = z.object({
  status: z.enum(['pending', 'active', 'blocked']).default('active'),
})

// src/features/users/api/create.ts
const userSchema = z.object({
  email: z.email(),
  role: z.enum(['user', 'admin']),
})
export type UserFormValues = z.infer<typeof userSchema>
export type UserFormInput = Partial<UserFormValues>

// src/features/users/api/approve.ts
const approveUserSchema = z.object({ id: z.string() })

// src/features/users/api/block.ts
const blockUserSchema = z.object({ id: z.string() })
```

### 4.3 Server function signatures

| Function       | HTTP method      | Input                                                                 | Output                          | Side effects                                                                       |
| -------------- | ---------------- | --------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| `getUsersList` | `GET`            | `{ status: 'pending' \| 'active' \| 'blocked' }` (default `'active'`) | `User[]` ordered by `email` asc | none                                                                               |
| `createUser`   | `POST` (default) | `{ email: string (email), role: 'user' \| 'admin' }`                  | `void`                          | inserts row with `id = crypto.randomUUID()` and column-default `status = 'active'` |
| `approveUser`  | `POST` (default) | `{ id: string }`                                                      | `void`                          | sets `status = 'active'` where `user.id = id`                                      |
| `blockUser`    | `POST` (default) | `{ id: string }`                                                      | `void`                          | sets `status = 'blocked'` where `user.id = id`                                     |

All four MUST be wrapped with `.middleware([authGuard('admin')])`.

### 4.4 React Query keys

| Key                            | Used by                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `queryKeys.allUsers`           | Invalidated by `approveUser` and `blockUser`                                    |
| `queryKeys.listUsers(status?)` | Read by `getUserListOptions(status)`; invalidated by `createUser` (no-arg form) |

### 4.5 Component public APIs

```ts
// src/features/users/components/add-user.tsx
interface AddUserProps {
  children: JSX.Element
}

// src/features/users/components/approve-user.tsx
interface ApproveUserProps {
  userId: string
}

// src/features/users/components/block-user.tsx
interface BlockUserProps {
  userId: string
  userEmail: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
```

`UserForm` is a `withForm({ defaultValues: userDefaultValues, render })`
factory that exposes `email` (TextField) and `role` (SelectField with items
`Utilisateur`/`Administrateur`).

### 4.6 Route

| Path              | File                            | Loader                                                                         |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `/settings/users` | `src/routes/settings/users.tsx` | `ensureQueryData` for `getUserListOptions('active' \| 'blocked' \| 'pending')` |

## 5. Acceptance Criteria

- **AC-001** Listing active users
  - **Given** the caller is authenticated as admin and three users exist
    with statuses `active`, `pending`, `blocked`
  - **When** the client calls `getUsersList({ data: { status: 'active' } })`
  - **Then** only the `active` user is returned, in `email` ascending order.

- **AC-002** Non-admin denied
  - **Given** the caller is authenticated with `role = 'user'` and
    `status = 'active'`
  - **When** any of `getUsersList`, `createUser`, `approveUser`, `blockUser`
    is invoked
  - **Then** the call rejects with `Error('Permission denied')` (thrown by
    `authGuard('admin')`) and no DB read or write occurs.

- **AC-003** Unauthenticated redirect
  - **Given** there is no authenticated user
  - **When** any users server function is invoked
  - **Then** `authGuard` throws `redirect({ to: '/auth/login' })` before the
    role check runs.

- **AC-004** Create user
  - **Given** an admin submits the `AddUser` dialog with
    `{ email: 'a@b.co', role: 'user' }`
  - **When** validation passes and `createUser` resolves
  - **Then** a new `user` row exists with that email, role `'user'`, status
    `'active'`, and a UUID `id`; the `queryKeys.listUsers()` cache is
    invalidated; a success toast displays
    `Utilisateur a@b.co créé`; the dialog closes and the form resets.

- **AC-005** Create user with invalid email
  - **Given** the dialog is filled with `email = 'not-an-email'`
  - **When** the form attempts to submit
  - **Then** `userSchema.parse` throws under `onDynamic` validation, the
    server function is never called, and the dialog stays open.

- **AC-006** Approve a pending user
  - **Given** a user `u` with `status = 'pending'` and an admin caller
  - **When** the admin clicks the `ApproveUser` icon for `u`
  - **Then** `u.status` becomes `'active'`, `queryKeys.allUsers` is
    invalidated, and a `Utilisateur approuvé` success toast displays.

- **AC-007** Approve a blocked user
  - **Given** a user `u` with `status = 'blocked'` and an admin caller
  - **When** the admin clicks `ApproveUser` on the `Bloqués` tab
  - **Then** `u.status` becomes `'active'` and the row disappears from the
    `Bloqués` tab on cache refresh.

- **AC-008** Block on desktop
  - **Given** an active user row rendered on desktop
  - **When** the admin clicks the destructive-outline button and confirms
    `Bloquer` in the `DeleteDialog`
  - **Then** `blockUser` is called with that user id, status becomes
    `'blocked'`, `queryKeys.allUsers` is invalidated, and the
    `Utilisateur bloqué` toast displays.

- **AC-009** Block on mobile via swipe
  - **Given** mobile viewport and an active user row
  - **When** the admin drags the row left past `SWIPE_THRESHOLD = -100`
    and releases
  - **Then** the row animates back to `x = 0` and the `BlockUser` confirm
    dialog opens; confirming triggers AC-008.

- **AC-010** Swipe canceled
  - **Given** mobile viewport and an active user row
  - **When** the admin drags left to `x = -50` and releases (above the
    threshold)
  - **Then** the row animates back to `x = 0` and the dialog does NOT open.

- **AC-011** Search filtering
  - **Given** a list with users `alice@x.io (user)` and
    `bob@x.io (admin)`
  - **When** the admin types `admin` in the search box
  - **Then** only `bob@x.io` is shown; typing `alice` shows only Alice;
    typing `xyz` shows the empty-search message
    `Aucun utilisateur trouvé pour cette recherche.`.

- **AC-012** Empty tab
  - **Given** there are no `pending` users
  - **When** the `En attente` tab is visible and the search input is empty
  - **Then** the panel renders the message
    `Aucun utilisateur en attente.`.

- **AC-013** Tab visibility of buttons
  - **Given** the active tab is `Actifs`
  - **Then** rows show no `ApproveUser` and (on desktop) show `BlockUser`.
  - **Given** the active tab is `Bloqués`
  - **Then** rows show `ApproveUser` and no `BlockUser` (desktop or mobile).
  - **Given** the active tab is `En attente`
  - **Then** rows show `ApproveUser` AND `BlockUser` (desktop) /
    swipe-to-block (mobile).

- **AC-014** OAuth approval flow
  - **Given** a Google sign-in by an unknown email creates a user with
    `status = 'pending'` (auth feature) and an admin approves them
  - **When** the user retries Google sign-in
  - **Then** sign-in succeeds (`authGuard` no longer redirects with
    `error=account_pending`).

## 6. Test Automation Strategy

- **Levels.** Unit-test each server function handler against an in-memory or
  miniflare-bound D1 instance. Component-test `AddUser`, `ApproveUser`,
  `BlockUser`, and the `SwipeToBlock` interaction with React Testing Library
  (firing `touchstart`/`touchmove`/`touchend` on the foreground element).
  Route-level tests cover loader behavior and tab/search rendering.
- **Frameworks.** Vitest via `vp test`. Mocking via Vitest spies on
  `@/lib/db` and `@tanstack/react-query` mutation results.
- **RBAC tests.** For each server function, assert two negative paths:
  unauthenticated (redirect) and authenticated non-admin (`'Permission
denied'`). One positive path per function.
- **Schema tests.** Snapshot-test `userSchema`, `approveUserSchema`,
  `blockUserSchema`, `getUsersListSchema` for accepted/rejected inputs.
- **Cache invalidation.** Assert that calling each mutation triggers
  `queryClient.invalidateQueries` with the documented key.
- **CI.** `vp check` then `vp test` in the standard pipeline.

## 7. Rationale & Context

- **Admin-only by design.** A small private app for a known group; admin
  approval prevents arbitrary Google accounts from gaining access while
  still letting Google handle credentials.
- **Two creation paths.** OAuth produces `pending` users (status reset by
  admin); `createUser` exists for admin convenience to pre-create accounts
  that bypass the pending step.
- **Default `status = 'active'` at the column level.** Admin-created users
  are trusted by definition; the default lives on the column so the server
  function does not need to set it explicitly and the OAuth flow can opt
  into `pending` by passing it.
- **Soft-blocking instead of deletion.** Preserves history and allows
  re-approval; the auth feature uses `status = 'blocked'` to redirect the
  user out of the app.
- **Single root invalidation key (`queryKeys.allUsers`).** Avoids stale
  per-status caches when a user changes status (e.g. pending -> active
  must update both lists).
- **Mobile swipe destructive action.** Matches platform conventions
  (iOS-style swipe-to-delete) on small screens where icon buttons are
  cramped; desktop keeps an explicit visible button.

## 8. Dependencies & External Integrations

| Kind     | Reference                                                                                      | Use                                     |
| -------- | ---------------------------------------------------------------------------------------------- | --------------------------------------- |
| Internal | `@/lib/auth/auth-guard`                                                                        | RBAC enforcement (`authGuard('admin')`) |
| Internal | `@/lib/db` (`getDb`)                                                                           | Drizzle D1 client                       |
| Internal | `@/lib/db/schema` (`user`)                                                                     | Drizzle table definition                |
| Internal | `@/lib/query-keys` (`queryKeys.allUsers`, `queryKeys.listUsers`)                               | React Query key factory                 |
| Internal | `@/components/common/toast` (`toastManager`) and `@/lib/toast-helpers` (`toastError`)          | User feedback                           |
| Internal | `@/components/dialogs/delete-dialog` (`DeleteDialog`)                                          | Confirmation UX for `BlockUser`         |
| Internal | `@/components/dialogs/form-dialog` (`getFormDialog`)                                           | Form host for `AddUser`                 |
| Internal | `@/hooks/use-app-form` (`useAppForm`, `withForm`)                                              | TanStack Form integration               |
| Internal | `@/hooks/use-is-mobile`                                                                        | Toggle desktop vs swipe UX              |
| External | `@tanstack/react-start` (`createServerFn`, `createMiddleware`)                                 | Server-function runtime                 |
| External | `@tanstack/react-query` (`queryOptions`, `mutationOptions`, `useMutation`, `useSuspenseQuery`) | Cache + mutations                       |
| External | `@tanstack/react-form` (`revalidateLogic`, `useStore`)                                         | Form state                              |
| External | `@tanstack/react-router` (`createFileRoute`, `redirect`)                                       | Route + redirects                       |
| External | `drizzle-orm` (`eq`) and `drizzle-orm/sqlite-core`                                             | DB query/schema                         |
| External | `zod`                                                                                          | Input validation                        |
| Native   | Touch events (`onTouchStart`/`onTouchMove`/`onTouchEnd`) + CSS transition                      | Mobile swipe gesture                    |
| External | `@phosphor-icons/react` (`CheckIcon`, `PlusIcon`, `ProhibitIcon`)                              | Icons                                   |

## 9. Examples & Edge Cases

### 9.1 Approve from pending

```ts
const m = useMutation(approveUserOptions())
await m.mutateAsync({ data: { id: userId } })
// user.status -> 'active'; queryKeys.allUsers invalidated
```

### 9.2 Create then immediately re-create same email

The unique constraint on `email` causes the second `createUser` to throw at
the DB layer; the `onError` handler emits
`Erreur lors de la création de l'utilisateur <email>`.

### 9.3 Approving an already-active user

`approveUser` is idempotent: `UPDATE ... SET status = 'active'` is a no-op
on an already-active row but still triggers cache invalidation and the
success toast.

### 9.4 Blocking the last admin

Not prevented by the spec or code: an admin can block another admin (or, in
principle, themselves on a different session). UI surfaces this only as a
toast; recovery requires direct DB access.

### 9.5 Search on empty input

`search.trim().toLowerCase()` returns an empty string; `'foo'.includes('')`
is `true`, so an empty search shows all rows.

### 9.6 Swipe drag clamping

`dragConstraints={{ left: -150, right: 0 }}` caps the drag at -150px;
`dragElastic={0.1}` allows a small overshoot before snapping back.

### 9.7 Pending tab on desktop

The pending tab shows BOTH `ApproveUser` (because status is `'pending'`)
AND `BlockUser` (because `showBlockButton = status === 'active' || status
=== 'pending'`).

### 9.8 OAuth user id collision

Admin-created users use `crypto.randomUUID()`, which has negligible
collision probability with Google user ids; nevertheless the `id` column is
a primary key, so a colliding insert would fail loudly rather than silently
overwrite.

## 10. Validation Criteria

- **VAL-001** Type-check passes (`vp check`).
- **VAL-002** Lint and format pass (`vp lint`, `vp fmt`).
- **VAL-003** All four server functions in
  `src/features/users/api/*.ts` start with
  `.middleware([authGuard('admin')])`.
- **VAL-004** `userSchema` matches the schema quoted in section 4.2 exactly
  (used by both `AddUser` and `createUser`).
- **VAL-005** The route loader in `src/routes/settings/users.tsx`
  preloads `getUserListOptions('active' | 'pending' | 'blocked')`.
- **VAL-006** `SWIPE_THRESHOLD === -100` in `src/routes/settings/users.tsx`.
- **VAL-007** `BlockUser` passes `actionLabel="Bloquer"` and
  `icon={ProhibitIcon}` to `DeleteDialog`.
- **VAL-008** Each mutation factory invalidates either
  `queryKeys.allUsers` (approve, block) or `queryKeys.listUsers()`
  (create) on success.
- **VAL-009** No `deleteUser` server function exists in
  `src/features/users/api/`.

## 11. Related Specifications / Further Reading

- [Architecture overview](../../docs/architecture.spec.md)
- [Server functions infrastructure](../../docs/infrastructure/server-functions.spec.md)
- [Data layer (Drizzle + D1)](../../docs/infrastructure/data-layer.spec.md)
- [Auth feature spec](../auth/auth.spec.md)
