---
title: Server Functions Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, tanstack-start, server-functions, middleware, validation, zod]
---

## 1. Purpose & Scope

This specification defines how server-side logic is exposed to the client in the recipe-organizer
application. It covers the conventions for declaring server functions with TanStack Start, the
middleware pipeline (authentication, authorization, error handling), input validation with Zod,
the FormData round-trip used for multipart writes, error normalisation, and the integration with
TanStack Query (read `queryOptions` factories, write `mutationOptions` factories with toast +
cache invalidation). It also documents low-level API route handlers (`createFileRoute`) used for
binary streaming (R2) and OAuth callbacks.

Audience: contributors adding or modifying server functions, query/mutation factories, or API
routes. Out of scope: the database schema (see `./data-layer.spec.md`), runtime/platform
configuration (see `./platform.spec.md`), client form bindings (see `./forms.spec.md`),
file-based routing rules (see `./routing-ssr.spec.md`).

Assumptions:

- Runtime is Cloudflare Workers; `cloudflare:workers` `env` exposes bindings (D1, R2, IMAGES,
  GOOGLE_CLIENT_ID/SECRET).
- Bundler is Vite+ via `vp`; runtime is TanStack Start with file-based routing.

## 2. Definitions

- **Server Function**: a function declared with `createServerFn({ method })` from
  `@tanstack/react-start`. Callable from client and server; serialised over HTTP.
- **Server-only Function**: a function declared with `createServerOnlyFn(...)`. Invocable only
  from server contexts (e.g. inside a route `server.handlers.GET`).
- **Middleware**: a function-type middleware created with
  `createMiddleware({ type: 'function' }).server(...)`. Runs before the handler and may inject
  values into `context`.
- **Input Validator**: a Zod schema or transformer function passed to `.inputValidator(...)`
  that parses and types the `data` argument of the handler.
- **Query Options Factory**: a function named `get<X>Options(...)` returning
  `queryOptions({ queryKey, queryFn })`, exported alongside the read server function.
- **Mutation Options Factory**: a function named `<verb><X>Options(...)` returning
  `mutationOptions({ mutationFn, onSuccess, onError })`, exported alongside the write server
  function.
- **API Route Handler**: a low-level handler exported via
  `createFileRoute(...)({ server: { handlers: { GET, HEAD, POST } } })`. Used when a server
  function is unsuitable (binary streaming, OAuth redirect callbacks).
- **Auth Guard**: middleware factory `authGuard(role?: 'admin')` from
  `src/features/auth/lib/auth-guard.ts`.
- **withServerError**: handler wrapper from `src/utils/error-handler.ts` that normalises
  thrown errors.
- **D1 Batch**: `getDb().batch([...])` — sqlite multi-statement transaction primitive.

## 3. Requirements, Constraints & Guidelines

### 3.1 Declaration & file layout

- **REQ-001**: Server functions MUST be declared with `createServerFn({ method })` imported
  from `@tanstack/react-start`. `method` MUST be `'GET'` for reads and `'POST'` for any write
  (create, update, delete). The default applies for delete operations as well; deletes MUST
  NOT use HTTP DELETE.
- **REQ-002**: Server-only helpers (callable solely from server-side contexts such as API route
  handlers) MUST be declared with `createServerOnlyFn(...)`. Example:
  `handleGoogleCallback` in `src/features/auth/api/google-auth.ts`.
- **REQ-003**: Middleware MUST be declared with `createMiddleware({ type: 'function' }).server(...)`
  and MUST inject values into the handler via `next({ context: { ... } })`.
- **REQ-004**: Each feature MUST own an `api/` folder with one server function per file. File
  names MUST match the verb / action: `create.ts`, `update.ts`, `delete.ts`, `get-all.ts`,
  `get-one.ts`, `get-instructions.ts`, `approve.ts`, `block.ts`, `get-recipe-by-ids.ts`.
- **REQ-005**: Each `api/*.ts` file MUST export both (a) the bare server function (when needed
  by another server function) and (b) a `*Options()` factory (`queryOptions` for reads,
  `mutationOptions` for writes) for client consumption.
- **REQ-006**: Zod validation schemas MUST be defined in the same file as the function. A
  schema reused by another verb (typically `update`) MUST be exported and extended via
  `schema.extend({ id: z.number() })` rather than redeclared. Reference: `recipeSchema` in
  `src/features/recipe/api/create.ts` is reused by `update.ts` as
  `recipeSchema.extend({ id: z.number() })`. Same pattern for ingredients.

### 3.2 Input validation

- **REQ-010**: All server functions taking input MUST declare an `.inputValidator(...)`. JSON
  inputs MUST pass a Zod schema directly (e.g. `.inputValidator(updateIngredientSchema)`).
- **REQ-011**: FormData / multipart inputs MUST use the function form
  `.inputValidator((formData: FormData) => schema.parse(parseFormData(formData)))`. Reference:
  `src/features/recipe/api/create.ts`, `update.ts`.
- **REQ-012**: The FormData round-trip MUST use the helpers in `src/utils/form-data.ts`:
  - Client serialisation: `objectToFormData(values)` — `File` values are appended as `File`,
    `null`/`undefined` are skipped, everything else is `JSON.stringify`'d.
  - Server parsing: `parseFormData(fd)` — every entry whose value is a string and parses as
    JSON is `JSON.parse`'d, otherwise kept as-is (this preserves `File` objects).
- **REQ-013**: Zod `.parse(...)` MUST be used (not `.safeParse`); failures bubble up as
  `ZodError` and are converted to `Error('Invalid Schema; ...')` by `withServerError`.

### 3.3 Error handling

- **REQ-020**: Every server function handler MUST be wrapped in `withServerError(...)` from
  `src/utils/error-handler.ts`. The wrapper is cheap and yields uniform error semantics across
  the codebase (rethrow Router control flow, translate `ZodError`, normalise everything else).
- **REQ-021**: `withServerError` MUST rethrow `notFound()` and `redirect()` from
  `@tanstack/react-router` unchanged so that TanStack Router can interpret them.
- **REQ-022**: `withServerError` MUST translate `ZodError` to
  `new Error('Invalid Schema; <message>', { cause: error })`.
- **REQ-023**: Any other thrown error MUST be `console.error`-logged with the prefix
  `Internal Server Error :` and rethrown as
  `new Error('Une erreur est survenue', { cause: error })`. The original error MUST be
  preserved in `cause` for debugging.

### 3.4 Authentication & authorization

- **REQ-030**: Any server function that mutates data or returns user-scoped data MUST attach
  the `authGuard()` middleware. Reads of admin-only data (e.g. user list) MUST attach
  `authGuard('admin')`.
- **REQ-031**: `authGuard(role?: string)` MUST behave as follows:
  - If `getAuthUser()` returns `undefined`, throw `redirect({ to: '/auth/login' })`.
  - If `user.status === 'blocked'`, throw `redirect({ to: '/auth/login', search: { error: 'account_blocked' } })`.
  - If `user.status === 'pending'`, throw `redirect({ to: '/auth/login', search: { error: 'account_pending' } })`.
  - If `role === 'admin'` and `user.role !== 'admin'`, throw `new Error('Permission denied')`.
  - Otherwise call `next({ context: { user } })`.
- **REQ-032**: `getAuthUser` MUST return a synthetic admin user (`email: 'admin@test.fr'`,
  `id: 'string'`, `role: 'admin'`, `status: 'active'`) when `import.meta.env.DEV` is true.
  Production paths MUST read `userId` from `useAppSession()` and look up the user in D1.
- **REQ-033**: Per-row ownership checks MUST be performed inside the handler after the guard.
  For recipe `update` and `delete`: after fetching the row, throw
  `new Error('Permission denied')` unless `currentRecipe.createdBy === context.user.id` or
  `context.user.role === 'admin'`.
- **SEC-001**: User creation through Google OAuth MUST default new users to
  `status: 'pending'` and `role: 'user'`. Activation requires admin approval via
  `approveUser`.
- **SEC-002**: `initiateGoogleAuth` MUST generate a 16-byte random `state` value, persist it
  in `useOAuthSession()`, and the callback MUST verify it equals the returned state. Mismatch
  MUST redirect to `/auth/login?error=invalid_state`.
- **SEC-003**: Google OAuth client credentials MUST be read exclusively from
  `cloudflare:workers` `env.GOOGLE_CLIENT_ID` / `env.GOOGLE_CLIENT_SECRET`. They MUST NOT be
  bundled into client code.
- **SEC-004**: `logout` MUST call `session.clear()` on `useAppSession()`.
- **SEC-005**: User-supplied input that participates in DB writes MUST be Zod-validated. The
  recipe handler relies on Drizzle parameterised queries — ad-hoc string concatenation is
  forbidden (see `./data-layer.spec.md`).

### 3.5 Side effects & R2

- **REQ-040**: Image uploads MUST go through `uploadFile` (`src/lib/r2.ts`), which transforms
  via `env.IMAGES` to webp at 1024px width, quality 80, and stores in `env.R2_BUCKET` under a
  `crypto.randomUUID()` key. Video uploads MUST go through `uploadVideo` (no transformation).
- **REQ-041**: When replacing an existing R2 asset (e.g. recipe image/video update), the
  handler MUST `await deleteFile(currentKey)` before `uploadFile/uploadVideo`. Reference:
  `resolveImageKey` / `resolveVideoKey` in `src/features/recipe/api/update.ts`.
- **REQ-042**: When deleting a row that owns R2 assets, the DB batch MUST run before
  `deleteFile(...)`. Counterexample: deleting the file first leaves orphaned references on DB
  failure.
- **REQ-043**: Binary asset retrieval MUST be served by an API route handler using
  `createR2GetHandler(defaultContentType)` (and `createR2HeadHandler` for video). Reference:
  `src/routes/api/image/$id.ts`, `src/routes/api/video/$id.ts`. These handlers wrap responses
  in `cache.getWithCache(request.url)` and emit
  `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`. Missing keys MUST
  throw `notFound()`.

### 3.6 D1 batching & sequencing

- **REQ-050**: Multi-statement related writes MUST use `getDb().batch([...])`. Reference:
  recipe `update` / `delete` batch the dependent deletes; `update` also batches the read of
  `ingredient.category` and `recipe.tags` for vegetarian inference.
- **REQ-051**: When child rows depend on the auto-generated id of a parent row that must be
  read back from a batched insert, the dependent inserts MUST run in `Promise.all(...)` after
  the batch resolves, using `.returning()` from the parent insert. Reference:
  `recipeIngredientGroup` insert returning the `groupId` consumed by the `groupIngredient`
  insert in `src/features/recipe/api/create.ts` and `update.ts`.
- **REQ-052**: R2 side effects in mutation handlers MUST be sequenced after the DB batch /
  Promise.all block resolves, never before.

### 3.7 TanStack Query integration

- **REQ-060**: Read factories MUST be named `get<X>Options(...)` and MUST use the keys defined
  in `src/lib/query-keys.ts` (`queryKeys.recipeList()`, `queryKeys.recipeDetail(id)`,
  `queryKeys.listIngredients()`, `queryKeys.listUsers(status)`,
  `queryKeys.recipeListByIds(ids)`, `queryKeys.recipeInstructions(id)`).
- **REQ-061**: Write factories MUST be named `<verb><X>Options(...)` and MUST set
  `mutationFn` to the bare server function. They MUST handle:
  - `onSuccess`: call `context.client.invalidateQueries({ queryKey: <broadest-relevant-key> })`
    and (for user-facing mutations) emit a success toast via
    `toastManager.add({ type: 'success', title })`.
  - `onError`: call `toastError(<localised-message>, error)` from `src/lib/toast-helpers.ts`.
- **REQ-062**: Cache invalidation MUST target the broadest key the mutation can affect:
  - Recipe `create` invalidates `queryKeys.recipeLists()` (covers `recipeList()` and
    `recipeListByIds(...)`).
  - Recipe `update` / `delete` invalidate `queryKeys.allRecipes` (covers lists + detail +
    instructions).
  - Ingredient mutations invalidate `queryKeys.listIngredients()`.
  - User mutations invalidate `queryKeys.allUsers` (or `queryKeys.listUsers()` for create).
- **REQ-063**: Where a mutation operates on a named entity, the toast title and error message
  MUST include the human label (recipe title, ingredient name, user email). Recipe handlers
  MUST use `getTitle(variables.data)` from `src/features/recipe/utils/get-recipe-title`.
- **REQ-064**: Reads with explicit caching needs MUST set `staleTime` on the `queryOptions`.
  Reference: `getRecipeInstructionsOptions` uses `staleTime: 5 * 60 * 1000`.

### 3.8 API route handlers

- **CON-001**: API route handlers (`createFileRoute('/api/...')({ server: { handlers: ... } })`)
  MUST be used only for cases that server functions cannot model: binary streaming from R2,
  the Google OAuth callback (which must respond to a GET redirect from Google), and HEAD
  responses for video range support.
- **CON-002**: API route handlers MUST live under `src/routes/api/...` and follow file-based
  routing. They MUST delegate business logic to server functions or `createServerOnlyFn`
  helpers; they MUST NOT inline DB or R2 logic.

### 3.9 Coding constraints

- **CON-010**: Imports MUST come from `@tanstack/react-start` and `@tanstack/react-router`.
  Vite+ wraps `vite`/`vitest` — see `CLAUDE.md`. Test utility imports come from
  `vite-plus/test`.
- **CON-011**: D1 access MUST go through the singleton `getDb()` from `src/lib/db.ts`. Direct
  Drizzle client construction is forbidden.
- **CON-012**: Server functions MUST NOT throw plain HTTP responses. They MUST throw
  `redirect(...)`, `notFound()`, or `Error(...)`; the wrapper / framework converts these.
- **GUD-001**: One verb per file. Group queries together via the
  `mutationOptions/queryOptions` factories rather than barrel re-exports.
- **GUD-002**: Prefer `getDb().query.<table>.findMany`/`findFirst` for read-heavy with-relations
  queries. Use `getDb().select(...)` only when the relational query API is insufficient (e.g.
  projecting a single column for batched reads in recipe `update`).
- **GUD-003**: When a column is computed from input (e.g. auto-tags `vegetarian`, `magimix`),
  the computation MUST live in the server function, not the client form. The client value
  MUST always be re-validated and re-derived server-side.

## 4. Server Function Inventory

| Name                                 | File                                                  | Method | Middleware           | Inputs                                      | Output                                                       | Side effects                                                                                                                             |
| ------------------------------------ | ----------------------------------------------------- | ------ | -------------------- | ------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `getAuthUser`                        | `src/features/auth/api/get-auth-user.ts`              | GET    | none                 | none                                        | `User \| undefined`                                          | Reads `useAppSession`; in DEV returns synthetic admin                                                                                    |
| `initiateGoogleAuth`                 | `src/features/auth/api/google-auth.ts`                | POST   | none                 | none                                        | never (throws redirect)                                      | Generates `state`, writes `useOAuthSession`, redirects to Google                                                                         |
| `handleGoogleCallback` (server-only) | `src/features/auth/api/google-auth.ts`                | n/a    | none                 | `(code, state)` args                        | `User`                                                       | Exchanges OAuth code, upserts user (pending), writes `useAppSession`                                                                     |
| `logout`                             | `src/features/auth/api/logout.ts`                     | POST   | none                 | none                                        | `{ success: true }`                                          | `session.clear()`                                                                                                                        |
| `getAllRecipes`                      | `src/features/recipe/api/get-all.ts`                  | GET    | none                 | none                                        | `ReducedRecipe[]`                                            | Maps `image` through `getImageUrl`                                                                                                       |
| `getRecipe`                          | `src/features/recipe/api/get-one.ts`                  | GET    | none                 | `z.number()`                                | `Recipe` (with relations)                                    | Throws `notFound()` if missing                                                                                                           |
| `getRecipeInstructions`              | `src/features/recipe/api/get-instructions.ts`         | GET    | none                 | `z.number()`                                | `{ id, instructions, name } \| undefined`                    | none                                                                                                                                     |
| `getRecipesByIds`                    | `src/features/shopping-list/api/get-recipe-by-ids.ts` | GET    | none                 | `{ ids: number[] }`                         | `Recipe[]` flattened with linked ingredients scaled by ratio | none                                                                                                                                     |
| `createRecipe`                       | `src/features/recipe/api/create.ts`                   | POST   | `authGuard()`        | `FormData` -> `recipeSchema`                | `void`                                                       | R2 upload (image, optional video); D1 inserts (recipe, ingredient groups, group ingredients, linked recipes); auto-tag inference         |
| `updateRecipe`                       | `src/features/recipe/api/update.ts`                   | POST   | `authGuard()`        | `FormData` -> `recipeSchema.extend({ id })` | `id: number`                                                 | Per-row ownership check; R2 delete+upload (image/video) when replaced; D1 batch (update + cascade delete + reinsert); auto-tag inference |
| `deleteRecipe`                       | `src/features/recipe/api/delete.ts`                   | POST   | `authGuard()`        | `z.number()`                                | `void`                                                       | Per-row ownership check; D1 batch deletes; `deleteFile(image)`                                                                           |
| `getIngredientsList`                 | `src/features/ingredients/api/get-all.ts`             | GET    | none                 | none                                        | `Ingredient[]`                                               | none                                                                                                                                     |
| `createIngredient`                   | `src/features/ingredients/api/create.ts`              | POST   | `authGuard()`        | `ingredientSchema`                          | `void`                                                       | DB insert                                                                                                                                |
| `updateIngredient`                   | `src/features/ingredients/api/update.ts`              | POST   | `authGuard()`        | `ingredientSchema.extend({ id })`           | `void`                                                       | DB update                                                                                                                                |
| `deleteIngredient`                   | `src/features/ingredients/api/delete.ts`              | POST   | `authGuard('admin')` | `{ id: number }`                            | `void`                                                       | DB delete                                                                                                                                |
| `getUsersList`                       | `src/features/users/api/get-all.ts`                   | GET    | `authGuard('admin')` | `{ status }` (default `'active'`)           | `User[]`                                                     | none                                                                                                                                     |
| `createUser`                         | `src/features/users/api/create.ts`                    | POST   | `authGuard('admin')` | `{ email, role }`                           | `void`                                                       | DB insert with `crypto.randomUUID()`                                                                                                     |
| `approveUser`                        | `src/features/users/api/approve.ts`                   | POST   | `authGuard('admin')` | `{ id: string }`                            | `void`                                                       | DB update `status = 'active'`                                                                                                            |
| `blockUser`                          | `src/features/users/api/block.ts`                     | POST   | `authGuard('admin')` | `{ id: string }`                            | `void`                                                       | DB update `status = 'blocked'`                                                                                                           |

API route handlers (low-level):

| Path                        | File                                     | Methods   | Purpose                                                                      |
| --------------------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `/api/image/$id`            | `src/routes/api/image/$id.ts`            | GET       | Stream R2 image with edge cache                                              |
| `/api/video/$id`            | `src/routes/api/video/$id.ts`            | GET, HEAD | Stream / probe R2 video with edge cache                                      |
| `/api/auth/google/callback` | `src/routes/api/auth/google/callback.ts` | GET       | Handle Google OAuth redirect; calls `handleGoogleCallback`; redirects to `/` |

## 5. Patterns

### PAT-001 — Read query options factory

```ts
const getX = createServerFn({ method: 'GET' })
  .inputValidator(xSchema)
  .handler(
    withServerError(async ({ data }) => {
      /* ... */
    })
  )

const getXOptions = (arg) =>
  queryOptions({
    queryFn: () => getX({ data: arg }),
    queryKey: queryKeys.x(arg),
  })

export { getXOptions }
```

### PAT-002 — Mutation options factory with FormData

```ts
const createX = createServerFn()
  .middleware([authGuard()])
  .inputValidator((formData: FormData) => xSchema.parse(parseFormData(formData)))
  .handler(async ({ data, context }) => {
    /* ... */
  })

const createXOptions = () =>
  mutationOptions({
    mutationFn: createX,
    onError: (error, variables) => toastError(`...${getLabel(variables.data)}`, error),
    onSuccess: (_d, variables, _r, context) => {
      void context.client.invalidateQueries({ queryKey: queryKeys.x() })
      toastManager.add({ type: 'success', title: `... ${getLabel(variables.data)} ...` })
    },
  })
```

### PAT-003 — Per-row ownership check

After the auth guard injects `context.user`, fetch the row, then:

```ts
if (context.user.role !== 'admin' && row.createdBy !== context.user.id) {
  throw new Error('Permission denied')
}
```

### PAT-004 — Schema reuse for update

```ts
// create.ts
export const xSchema = z.object({
  /* ... */
})

// update.ts
import { xSchema } from './create'
const updateXSchema = xSchema.extend({ id: z.number() })
```

### PAT-005 — Replace-or-keep R2 asset

```ts
const resolveKey = async (next: File | { id: string } | undefined, currentKey: string | null) => {
  if (next instanceof File) {
    if (currentKey) await deleteFile(currentKey)
    return uploadFile(next)
  }
  if (next === undefined) return currentKey
  return next.id
}
```

### PAT-006 — Server-only helper invoked from API route

```ts
// google-auth.ts
export const handleGoogleCallback = createServerOnlyFn(async (code: string, state: string) => {
  /* ... */
})

// routes/api/auth/google/callback.ts
export const Route = createFileRoute('/api/auth/google/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        /* ... */ await handleGoogleCallback(code, state)
        throw redirect({ to: '/' })
      },
    },
  },
})
```

### PAT-007 — D1 batch + post-batch dependent inserts

Use `getDb().batch([...])` for independent statements, then `Promise.all` for dependent
inserts that need a returned id:

```ts
await getDb().batch([
  getDb()
    .update(recipe)
    .set({
      /* ... */
    })
    .where(eq(recipe.id, id)),
  getDb().delete(groupIngredient).where(/* ... */),
  getDb().delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
])

await Promise.all(
  ingredientGroups.map(async (group) => {
    const [created] = await getDb().insert(recipeIngredientGroup).values(/* ... */).returning()
    if (group.ingredients.length > 0) {
      await getDb().insert(groupIngredient).values(/* references created.id */)
    }
  })
)
```

## 6. Acceptance Criteria

- **AC-001 (REQ-010, REQ-013)**: Given a server function with `.inputValidator(zodSchema)`,
  when called with malformed JSON input, then the framework throws a `ZodError` and the
  client receives `Error('Invalid Schema; <message>')`.
- **AC-002 (REQ-011, REQ-012)**: Given a recipe form submitted as `FormData` produced by
  `objectToFormData`, when `createRecipe` runs, then `parseFormData` JSON-parses non-`File`
  values before `recipeSchema.parse` and `File` instances flow through to `uploadFile` /
  `uploadVideo` unchanged.
- **AC-003 (REQ-031)**: Given an unauthenticated request to a server function with
  `authGuard()`, when the function is invoked, then it throws `redirect({ to: '/auth/login' })`
  and never executes the handler body.
- **AC-004 (REQ-031)**: Given a non-admin user calling a function with `authGuard('admin')`,
  when invoked, then it throws `Error('Permission denied')`.
- **AC-005 (REQ-033)**: Given a recipe whose `createdBy` differs from the caller and the
  caller is not admin, when `updateRecipe` or `deleteRecipe` runs, then it throws
  `Error('Permission denied')` and no DB writes occur.
- **AC-006 (REQ-021)**: Given a handler wrapped in `withServerError` throws `notFound()`,
  when the wrapper sees the error, then it rethrows the same `notFound()` so TanStack Router
  renders the not-found UI.
- **AC-007 (REQ-040, REQ-041)**: Given an `updateRecipe` call where `image` is a `File`, when
  the handler runs, then `deleteFile(currentKey)` resolves before `uploadFile(file)` and the
  new key is persisted to `recipe.image`.
- **AC-008 (REQ-051)**: Given an ingredient group with `groupIngredients`, when inserted
  during `createRecipe`, then the `groupId` used for `groupIngredient.values` equals the `id`
  returned by the parent `recipeIngredientGroup` insert.
- **AC-009 (REQ-061, REQ-062)**: Given a successful `createRecipe`, when `mutationFn`
  resolves, then `queryClient.invalidateQueries({ queryKey: queryKeys.recipeLists() })` is
  called and a success toast titled `Recette <name> créée` is emitted.
- **AC-010 (SEC-002)**: Given `/api/auth/google/callback` is hit with a `state` that does not
  match `useOAuthSession().data.oauthState`, when `handleGoogleCallback` runs, then it
  redirects to `/auth/login?error=invalid_state` and does not exchange the code.
- **AC-011 (CON-001)**: Given a request to `/api/image/<key>` for a non-existent key, when the
  R2 GET handler runs, then `env.R2_BUCKET.get(id)` returns null and the handler throws
  `notFound()`.
- **AC-012 (REQ-032)**: Given `import.meta.env.DEV === true`, when any server function runs
  through `authGuard`, then the injected `context.user` equals
  `{ id: 'string', email: 'admin@test.fr', role: 'admin', status: 'active' }`.

## 7. Test Automation Strategy

- **Test types**: unit tests for pure helpers (`withServerError`, `parseFormData`,
  `objectToFormData`, `authGuard` redirect/permission branches), integration tests for server
  functions backed by an in-memory or local D1 (Miniflare/Wrangler), end-to-end tests for the
  Google OAuth callback round-trip via the dev server.
- **Frameworks**: Vitest via `vp test`. Import test utilities from `vite-plus/test`. Mock
  `cloudflare:workers` `env` with module mocks; provide a fake `R2_BUCKET` and `IMAGES`
  binding.
- **Test data management**: Use Drizzle migrations against a per-test sqlite/D1 instance
  (`pnpm db:migrate:local`). Each test seeds its own rows; do not rely on shared
  fixtures.
- **CI/CD**: `vp check` and `vp test` MUST pass before merge (see `CLAUDE.md`). New server
  functions MUST have at least one happy-path integration test plus one auth/authz test.
- **Coverage**: Target 100% line coverage for `error-handler.ts`, `form-data.ts`, and
  `auth-guard.ts` — these gate every handler.
- **Performance**: Recipe queries that hydrate relations (`getRecipe`, `getRecipesByIds`)
  SHOULD be benchmarked against representative datasets to keep p95 < 200 ms on a warmed
  worker.

## 8. Rationale & Context

- **POST for delete (REQ-001)**: Keeps the surface uniform with TanStack Start's RPC layer
  and avoids CSRF nuances around HTTP DELETE; deletes carry a body anyway.
- **FormData for recipe writes (REQ-011)**: Recipes carry image/video `File` instances that
  cannot be JSON-serialised. The `objectToFormData`/`parseFormData` pair preserves the
  isomorphism: every non-File field round-trips through `JSON.stringify`/`JSON.parse`.
- **`withServerError` wrapper (REQ-020-023)**: Preserves Router control flow (`notFound`,
  `redirect`) while normalising any other exception to a stable French user-facing message
  (`Une erreur est survenue`) without leaking server internals. The original error is kept on
  `cause` for server logs.
- **Per-row ownership inside the handler (REQ-033)**: The auth guard cannot know the row id
  before validation runs, so the row-level check must live in the handler. Admins bypass it.
- **DEV synthetic admin (REQ-032)**: Keeps local development friction-free without requiring
  a working Google OAuth setup; gated on `import.meta.env.DEV` and removed from production
  bundles.
- **D1 batch over per-statement awaits (REQ-050)**: D1 charges per round-trip; batching
  collapses related writes into a single statement set and provides atomicity within the
  batch.
- **Server-only fn for OAuth callback (REQ-002, PAT-006)**: The callback URL must be a `GET`
  endpoint reachable by Google. A server function would expose a generic RPC envelope; an
  API route handler delegating to a server-only helper preserves the redirect semantics
  while keeping the OAuth logic colocated with `initiateGoogleAuth`.

## 9. Dependencies & External Integrations

### External systems

- **EXT-001 — Google OAuth 2.0**: Token exchange at
  `https://oauth2.googleapis.com/token`; user info at
  `https://www.googleapis.com/oauth2/v2/userinfo`. Scopes: `openid email profile`.
- **EXT-002 — Cloudflare D1**: Accessed via `getDb()` (Drizzle adapter). See
  `./data-layer.spec.md`.
- **EXT-003 — Cloudflare R2**: Object storage for images and videos. Bound as
  `env.R2_BUCKET`.
- **EXT-004 — Cloudflare Images**: Image transformation pipeline bound as `env.IMAGES`. Used
  by `uploadFile` to produce 1024-wide webp at quality 80.

### Third-party services

- **SVC-001 — Cloudflare Workers runtime**: see `./platform.spec.md`.

### Infrastructure dependencies

- **INF-001 — TanStack Start `@tanstack/react-start`**: provides `createServerFn`,
  `createServerOnlyFn`, `createMiddleware`.
- **INF-002 — TanStack Router `@tanstack/react-router`**: provides `redirect`, `notFound`,
  `isRedirect`, `isNotFound`, `createFileRoute`.
- **INF-003 — TanStack Query `@tanstack/react-query`**: provides `queryOptions`,
  `mutationOptions`.

### Data dependencies

- **DAT-001 — D1 schema**: tables `user`, `recipe`, `ingredient`, `recipeIngredientGroup`,
  `groupIngredient`, `recipeLinkedRecipes`. See `./data-layer.spec.md`.
- **DAT-002 — Sessions**: `useAppSession()` (user session) and `useOAuthSession()`
  (transient state during OAuth) defined in `src/lib/session.ts`.

### Technology platform

- **PLT-001**: Cloudflare Workers + TanStack Start + Vite+/Rolldown. See `./platform.spec.md`.

### Compliance

- **COM-001**: New users default to `pending`; admins must approve. Blocked users cannot
  authenticate. See `SEC-001`.

## 10. Examples & Edge Cases

### 10.1 Read happy path

Given a request `getRecipe({ data: 42 })` and a recipe row with id 42 exists:

When the handler runs,

Then it returns the recipe with hydrated `ingredientGroups` (ordered `isDefault` desc) and
`linkedRecipes`, with `image` mapped through `getImageUrl`.

### 10.2 Read missing row

Given `getRecipe({ data: 999 })` and no row with id 999:

When the handler runs,

Then it throws `notFound()`, `withServerError` rethrows it, and TanStack Router renders the
not-found UI.

### 10.3 Mutation with FormData

Given a client invokes `createRecipe(objectToFormData({ name: 'Pesto', servings: 4, image: file, ingredientGroups: [...], instructions: '...', tags: ['dessert'] }))`:

When the server runs,

Then `parseFormData` reconstructs the JSON, `recipeSchema.parse` validates it, `uploadFile`
stores the image, and the recipe is inserted with `createdBy = context.user.id`. If
`instructions` contains `"types":"magimixProgram"`, the auto-tag `magimix` is added. If all
`ingredient.category` values are non-meat/fish and no `dessert` tag is present, the auto-tag
`vegetarian` is added.

### 10.4 Mutation forbidden by ownership

Given a non-admin user calls `deleteRecipe({ data: 42 })` for a recipe owned by another user:

When the handler runs after `authGuard()` has passed,

Then `currentRecipe.createdBy !== context.user.id` and the handler throws
`Error('Permission denied')` before any DB or R2 mutation.

### 10.5 OAuth state mismatch

Given a malicious GET to `/api/auth/google/callback?code=...&state=tampered`:

When `handleGoogleCallback` runs and `oAuthSession.data.oauthState !== 'tampered'`,

Then it throws `redirect({ to: '/auth/login', search: { error: 'invalid_state' } })` before
exchanging the code.

### 10.6 R2 cache miss

Given a GET to `/api/image/<unknown-key>`:

When `createR2GetHandler('image/webp')` runs, `env.R2_BUCKET.get(id)` returns null,

Then the handler throws `notFound()`. The `cache.getWithCache` wrapper does not cache the
error response.

### 10.7 Edge case — empty linked recipes

Given a recipe with no `linkedRecipes` and no `ingredientGroups[].ingredients`:

When `createRecipe` runs,

Then both `hasIngredients` and `hasLinkedRecipes` are false, vegetarian inference defaults to
`true`, and the recipe is inserted with the auto-tag `vegetarian` (unless `dessert` is
present in `tags`).

### 10.8 Edge case — `JSON.stringify` of a numeric string

Given a form field value `'42'`:

When serialised by `objectToFormData`, the entry becomes `'"42"'`. `parseFormData` JSON-parses
it to the string `'42'`, not the number 42. Schemas MUST therefore declare numeric inputs as
`z.number()` and rely on the client passing actual numbers (Zod `.coerce` is not used).

## 11. Validation Criteria

- **VAL-001**: Every file under `src/features/*/api/*.ts` exports either a `*Options` factory
  or a server-only helper (no orphaned server functions).
- **VAL-002**: Every write server function attaches `authGuard()` or `authGuard('admin')` as
  the first middleware.
- **VAL-003**: Every server function consuming inputs declares `.inputValidator(...)`.
- **VAL-004**: Every read server function (or its handler body) returns a value compatible
  with the `queryFn` contract — no `void` returns from reads.
- **VAL-005**: Every mutation factory invalidates at least one query key from
  `src/lib/query-keys.ts`.
- **VAL-006**: No server function imports from `vitest`, `vite`, or any non-`vite-plus` build
  module.
- **VAL-007**: No DB or R2 logic is inlined in `src/routes/api/**`; all such handlers
  delegate to server functions or `createServerOnlyFn` helpers.
- **VAL-008**: `vp check` (`fmt` + `lint` + `tsc`) and `vp test` pass on changes to any file
  under `src/features/*/api/` or `src/utils/error-handler.ts`,
  `src/utils/form-data.ts`, `src/lib/r2.ts`, `src/features/auth/lib/auth-guard.ts`.

## 12. Related Specifications / Further Reading

- `./data-layer.spec.md` — Drizzle schemas, D1 client, batch semantics.
- `./platform.spec.md` — Cloudflare Workers runtime, bindings, sessions.
- `./forms.spec.md` — TanStack Form usage, submission flow into `mutationOptions`.
- `./routing-ssr.spec.md` — File-based routes, loaders, prefetching server functions.
- `../architecture.spec.md` — System-level architecture overview.
