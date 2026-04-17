---
title: Server functions & mutation options
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./platform.spec.md
  - ./data-layer.spec.md
  - ./forms.spec.md
  - ../../src/features/auth/auth.spec.md
---

## 2. Problem Statement

Every server-side entry point in the app (other than the handful of HTTP API routes) is a TanStack Start
`createServerFn`. The platform gives us typed, RPC-like calls from the client, but several concerns must be
layered consistently on top:

- `[G-1]` Input validation via Zod, both for plain-JSON payloads and for multipart FormData bodies.
- `[G-2]` Auth & role enforcement via a shared `authGuard` middleware.
- `[G-3]` Error normalization so clients always receive a stable shape (Zod → "Invalid Schema", unknown →
  generic French message, redirects / not-found pass through untouched).
- `[G-4]` A consistent pairing with TanStack Query: each server function comes with either a
  `queryOptions(...)` factory (reads) or a `mutationOptions(...)` factory (writes) that also wires success /
  error toasts and cache invalidation.
- `[G-5]` Minimal boilerplate per handler: middleware + input validator + handler.

## 3. Key Design Decisions

| Decision                                                | Choice                                                                                   | Rationale                                                                                                                                                |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` One server function = one file                 | `src/features/<feature>/api/<verb>.ts`                                                   | Verbs as filenames keep surface discoverable; exports are named only (no default).                                                                       |
| `[KD-2]` Handler + options factory                      | Each file exports an `*Options()` factory that wraps the server fn in TanStack Query     | Co-locates cache invalidation + toasts with the handler; call sites stay one-liners.                                                                     |
| `[KD-3]` `authGuard(role?)` middleware                  | `src/features/auth/lib/auth-guard.ts`                                                    | Composable per-handler auth; role is optional and defaults to "any authenticated non-blocked user".                                                      |
| `[KD-4]` `withServerError` for reads / sensitive writes | `src/utils/error-handler.ts`                                                             | Swallows internal errors, keeps redirects / `notFound()` working, translates Zod errors.                                                                 |
| `[KD-5]` FormData for any payload with files            | `.inputValidator((formData: FormData) => schema.parse(parseFormData(formData)))`         | Image/video files require multipart; other fields are JSON-stringified in the FormData for simplicity (see `parseFormData` in `src/utils/form-data.ts`). |
| `[KD-6]` Reads default to unauthenticated               | List / detail / instructions endpoints omit `authGuard`                                  | Enables offline caching via the service worker for all users (including pre-login); no sensitive data in recipes.                                        |
| `[KD-7]` Permission re-checks at write time             | `update` / `delete` handlers load the row and compare `createdBy` with `context.user.id` | Defense in depth — UI hides actions but server re-validates.                                                                                             |
| `[KD-8]` French toasts from mutation factories          | `toastManager.add({ title, type: 'success' })` on success; `toastError(...)` on error    | Consistent UX; no per-call-site toast boilerplate.                                                                                                       |

## 4. Principles & Intents

- `[PI-1]` **Validate at the boundary** — every `createServerFn` calls `.inputValidator(schema)`. No handler
  consumes unvalidated `data`.
- `[PI-2]` **Middleware for cross-cutting concerns** — auth, role, tracing. Do not duplicate `getAuthUser()`
  inside handlers.
- `[PI-3]` **Fail with intent** — `throw redirect(...)` for auth-style redirects; `throw notFound()` for
  missing resources; `throw new Error('Permission denied')` for authz violations; `withServerError` for the
  "unknown error" translation.
- `[PI-4]` **Mutation options own cache invalidation** — never invalidate from call sites. The factory knows
  which bucket to bust.
- `[PI-5]` **Reads pair with `queryOptions`** — exports a factory so both `useQuery` and
  `router.loader` / `ensureQueryData` can share the same cache key.
- `[PI-6]` **Context comes from middleware** — authenticated handlers receive `context.user` via
  `authGuard()`. Do not re-fetch.

## 5. Non-Goals

- `[NG-1]` Public REST API beyond the handful of HTTP routes (`/api/auth/google/...`, `/api/image/:id`,
  `/api/video/:id`).
- `[NG-2]` gRPC / tRPC wire formats.
- `[NG-3]` Fine-grained rate limiting at the server-function level.
- `[NG-4]` Request-level audit logging.

## 6. Caveats

- `[C-1]` `withServerError` rethrows `isNotFound` / `isRedirect` exceptions verbatim, but swallows everything
  else into a generic French `Error('Une erreur est survenue')`. The original error is attached as `cause`;
  server logs retain the detail (via `console.error`).
- `[C-2]` `authGuard('admin')` throws a plain `Error('Permission denied')` — not a redirect. The client gets a
  toast via `toastError`, not a navigation. See auth spec `[C-3]`.
- `[C-3]` `createServerFn({ method: 'GET' })` is a hint for TanStack Start but does not change the HTTP verb
  semantics at the Worker — all server functions run through the same Start pipeline.
- `[C-4]` Mutation option factories capture their query client lazily via `context.client.invalidateQueries`.
  Tests that construct a client must pass it through the mutation harness.
- `[C-5]` `parseFormData` attempts `JSON.parse` on every string value. Values that happen to look like JSON but
  are meant as strings (e.g., a literal `"null"`) will be parsed. Fields are named well enough that this is not
  a problem in practice, but know the footgun.
- `[C-6]` Dev mode shortcut: in `import.meta.env.DEV`, `getAuthUser` returns a mocked admin, which means
  `authGuard` always passes. Tests that depend on real auth must run in production mode or stub differently.

## 7. High-Level Components

| Component          | Module type               | Responsibility                                                                               | Public API surface                                        |
| ------------------ | ------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `authGuard`        | TanStack Start middleware | Enforce logged-in + non-blocked/non-pending; optional admin role gate; inject `context.user` | `authGuard(role?)`                                        |
| `withServerError`  | Higher-order function     | Wrap a handler, normalizing thrown errors for client consumption                             | `withServerError(handler)`                                |
| Form-data helpers  | Utilities                 | `objectToFormData` (client) / `parseFormData` (server)                                       | `src/utils/form-data.ts`                                  |
| Mutation factories | Convention                | `*Options()` functions exporting `mutationOptions({ mutationFn, onSuccess, onError })`       | `create*Options`, `update*Options`, `delete*Options`, ... |
| Query factories    | Convention                | `get*Options(args?)` exporting `queryOptions({ queryFn, queryKey, staleTime? })`             | `get*ListOptions`, `get*DetailsOptions`, ...              |
| Toast helpers      | Utilities                 | Consistent French failure toasts                                                             | `src/lib/toast-helpers.ts` → `toastError`                 |
| Session helpers    | Server utilities          | App + OAuth cookie session wrappers                                                          | `src/lib/session.ts`                                      |

## 8. Detailed Design

| Concern                             | Entry point                                        |
| ----------------------------------- | -------------------------------------------------- |
| `authGuard`                         | `src/features/auth/lib/auth-guard.ts`              |
| `withServerError`                   | `src/utils/error-handler.ts`                       |
| `parseFormData`, `objectToFormData` | `src/utils/form-data.ts`                           |
| Toast helper                        | `src/lib/toast-helpers.ts`                         |
| Example CRUD set                    | `src/features/ingredients/api/` (short, canonical) |
| Example complex create              | `src/features/recipe/api/create.ts`                |
| Example read with detail            | `src/features/recipe/api/get-one.ts`               |

Canonical handler shape:

```typescript
const thingSchema = z.object({ ... })

export const doThing = createServerFn({ method: 'POST' })
  .middleware([authGuard()])
  .inputValidator(thingSchema)
  .handler(withServerError(async ({ data, context }) => {
    // context.user is available from authGuard
    // data is the parsed, validated payload
  }))

export const doThingOptions = () =>
  mutationOptions({
    mutationFn: doThing,
    onError: (error, variables) => { toastError(`Erreur ...`, error) },
    onSuccess: async (_, variables, _r, context) => {
      await context.client.invalidateQueries({ queryKey: queryKeys.... })
      toastManager.add({ title: '...', type: 'success' })
    },
  })
```

Canonical read shape:

```typescript
const getThingSchema = z.object({ id: z.number() })

export const getThing = createServerFn({ method: 'GET' })
  .inputValidator(getThingSchema)
  .handler(withServerError(async ({ data }) => { ... }))

export const getThingOptions = (id: number) =>
  queryOptions({
    queryFn: () => getThing({ data: { id } }),
    queryKey: queryKeys.thingDetail(id),
  })
```

FormData-based create:

```typescript
.inputValidator((formData: FormData) => recipeSchema.parse(parseFormData(formData)))
```

The client sends via `objectToFormData(values)` (see `src/utils/form-data.ts`), which `JSON.stringify`s everything
that isn't a `File`. The server's `parseFormData` reverses that, `JSON.parse`ing every string value that looks
like JSON.

## 9. Verification Criteria

- `[VC-1]` Every server function under `src/features/*/api/` uses `.inputValidator(...)` — no raw `data`
  consumption.
- `[VC-2]` Every mutation is paired with a `*Options()` factory in the same file, not called directly from
  components.
- `[VC-3]` `authGuard` is applied to all write endpoints (create / update / delete) and admin-only read
  endpoints (e.g., `getUsersList`).
- `[VC-4]` `withServerError` is applied to handlers whose failure modes include non-`redirect` errors that the
  client consumes (read handlers, recipe mutations).
- `[VC-5]` FormData-based handlers use `parseFormData(formData)` in the validator, not manual `formData.get`
  calls.
- `[VC-6]` Mutation `onSuccess` calls `context.client.invalidateQueries({ queryKey: ... })` with the tightest
  correct bucket.
- `[VC-7]` `pnpm typecheck` passes — `context.user` is typed as the auth middleware's return.
- `[VC-8]` `pnpm lint` passes (no new `any`, no `console.*`, no non-null assertions, etc.).

## 10. Open Questions

- `[OQ-1]` Is there value in extracting a typed `createMutation(...)` helper that bakes in toast + invalidation
  defaults? Today each factory reimplements the same shape.
- `[OQ-2]` Should `authGuard('admin')` redirect instead of throwing? See auth spec `[OQ-1]`.
- `[OQ-3]` Should `parseFormData` be stricter about what it `JSON.parse`s, to avoid the string-that-looks-like-JSON
  footgun?
