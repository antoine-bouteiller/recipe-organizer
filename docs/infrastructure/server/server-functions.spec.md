---
title: Void Feature API
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md, docs/infrastructure/client/routing-ssr.spec.md]
---

## 2. Problem Statement

Screens and forms need a typed Worker boundary that validates untrusted input, applies membership
and ownership policy, and performs persistence effects. All server data and mutations use the
same-origin Void API; client query options cache reads and mutation options invalidate keys.
This refines architecture [PI-2], [PI-3], and [PI-4].

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                       | Rationale                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `[KD-1]` Declaration         | `routes/api/**` files export named HTTP methods.                                             | One API surface serves every screen and independent browser consumer. |
| `[KD-2]` Trust sequence      | Protected handlers authorize, validate, check ownership where applicable, then write.        | UI gates cannot authorize persistence.                                |
| `[KD-3]` Wire transport      | Writes accept JSON or bracket-key multipart when a File is present.                          | Shared schemas validate structured inputs at the Worker.              |
| `[KD-4]` Error envelope      | API failures use `{ error }`; invalid write bodies add dotted-path `errors` with status 400. | Internal faults remain safe application messages.                     |
| `[KD-5]` Refresh integration | Feature mutation options invalidate affected central query-key prefixes.                     | Active queries refetch while browser intent and local drafts survive. |

## 4. Principles & Intents

- `[PI-1]` **Validate inside the Worker** — client validation never authorizes writes.
- `[PI-2]` **Feature owns its mutation** — API handlers compose domain helpers; client options own cache invalidation.
- `[PI-3]` **Control flow is semantic** — client guards choose screens, API status codes express authorization and failures, and ordinary failures share a safe envelope.

## 5. Non-Goals

- `[NG-1]` A separately deployed API tier; Void feature routes share the generated Worker entry,
  refining architecture [PI-1].
- `[NG-2]` Authorization based only on a browser-provided user identifier.
- `[NG-3]` Binary media streaming through an RPC payload; Void media routes return raw HTTP responses.

## 6. Caveats

- `[C-1]` A development auth branch supplies a synthetic admin, as recorded in architecture [C-4];
  it cannot demonstrate the OAuth path.
- `[C-2]` Void RPC crosses an HTTP boundary, so route contracts use JSON or multipart data rather
  than Worker objects or streams.
- `[C-3]` R2 effects cannot join D1 batching; write ordering explicitly limits inconsistent states.
- `[C-4]` Void generates API types in `.void/`; run `vp exec void prepare` after route changes and before clean-tree checks.

## 7. High-Level Components

| Component              | Module type                                | Responsibility                                 | Public API surface                         |
| ---------------------- | ------------------------------------------ | ---------------------------------------------- | ------------------------------------------ |
| API handlers           | `routes/api/**`                            | Reads, writes, session, auth, health and media | Named GET/POST/PUT/PATCH/DELETE exports    |
| Schema boundary        | API handler                                | Validate body, query, params and files         | Zod, `withValidator`, `readRecipeFormData` |
| Feature client options | `src/features/*/client/api/<operation>.ts` | Requests and cache invalidation                | `queryOptions`, `mutationOptions`          |
| Response helper        | `src/lib/client/api-client.ts`             | Safe HTTP errors and login navigation          | `readResponse`, `getErrorMessage`          |
| Authorization          | Server auth helpers                        | Protect reads and writes                       | `withAuthGuard`                            |
| Validation error       | `src/lib/server/http-error.ts`             | Dotted field messages                          | `FieldValidationError`                     |

## 8. Detailed Design

### 8.1 Function declaration and placement

Void API files export named HTTP methods and import domain reads/writes from
`@/features/<feature>/server/*` and `@/lib/server/*`. Shared schemas live at the feature root;
server persistence helpers stay in `server/`. Browser screens under `src/pages/` consume
feature query/mutation options, never Worker-bound runtime helpers. No page-action compatibility
path or server page companions remain.

### 8.2 Validation and FormData contract

JSON/query/params use `defineHandler.withValidator` and shared Zod schemas. Recipe POST/PUT
handlers keep `readRecipeFormData` and `validateRecipeForm`: JSON remains structured and strict;
bracket-key multipart is reconstructed and normalized only for that transport. File values remain
binary. PUT validates the path ID and rejects a submitted body ID that does not match it.

```ts
// src/lib/server/http-error.ts
export class FieldValidationError extends Error {
  readonly errors: Record<string, string>
}
```

`validateRecipeForm` throws this error rather than a framework page-protocol validation error.

### 8.3 Authorization and ownership contract

Writes use `withAuthGuard` with the member/admin guard in section 8.7; directory reads require
admin as well. Authorization runs before handler validation and sets `apiUser`. Missing identity
returns 401; inactive membership and insufficient role return 403. Recipe mutation helpers
independently enforce owner-or-admin. Client router guards only choose screens and do not replace
any of these checks.

### 8.4 Error contract

`middleware/01.api-errors.ts` maps thrown API errors through `toApiErrorResponse`;
validator responses pass through `toApiValidationResponse`.

| Failure                                      | HTTP response                                                    |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `FieldValidationError` or invalid write body | `400 { error: string, errors: Record<string, string> }`          |
| `HttpError`                                  | Its status and `{ error }` message                               |
| Thrown `ZodError`                            | 400 schema error envelope; body validation includes field errors |
| Unknown API path                             | `404 { error: 'not_found' }`                                     |
| Unexpected error                             | Logged server-side; `500 { error: 'Une erreur est survenue' }`   |

Field-error keys are dotted body paths. `toApiValidationResponse` builds `errors` from
`withValidator` body-slot issues and preserves the existing `error` string.
`readResponse` preserves those details for `createForm`. It handles typed `FetchError`:
401 uses `location.assign('/auth/login')`; blocked/pending 403 adds the account-error query;
ordinary 403/404 and other failures throw safe errors. Non-HTTP failures propagate unchanged.
Browser forms resolve false for 400 field errors and alert other rejected failures.

### 8.5 Effects and ordering

API mutations validate/authorize before effects and delegate aggregate writes to server helpers.
D1 batching and R2 ordering follow the feature/data-layer contracts. Recipe deletion uses
`src/features/recipe/server/recipe-delete.ts`; create/update use `recipe-mutations.ts`.
R2 cannot participate in a D1 batch.

### 8.6 Query and mutation client contract

Feature `client/api/<operation>.ts` modules export `queryOptions`/`mutationOptions` calling
`readResponse(fetch(...))` from `void/client`. Screens use `createQuery` and `createMutation`;
the router preloads with `queryClient.ensureQueryData`. Mutation `onSuccess` invalidates keys
according to `docs/infrastructure/client/client-state.spec.md` section 8.5. Callers await writes
and own subsequent reset/close/navigation; DeleteDialog awaits its callback with local pending state.

### 8.7 API route boundary

| Route file                            | Method | Guard  | Body/query                          | Response                                     |
| ------------------------------------- | ------ | ------ | ----------------------------------- | -------------------------------------------- |
| `routes/api/session.ts`               | GET    | none   |                                     | `{ email, role, status } \| null`            |
| `routes/api/recipes/index.ts`         | GET    | none   |                                     | `listRecipes` result                         |
| `routes/api/recipes/index.ts`         | POST   | member | recipe form, JSON or multipart      | `{ id }`                                     |
| `routes/api/recipes/[id].ts`          | GET    | none   |                                     | `{ recipe, subrecipes }`; missing recipe 404 |
| `routes/api/recipes/[id].ts`          | PUT    | member | update form, JSON or multipart      | `{ id }`                                     |
| `routes/api/recipes/[id].ts`          | DELETE | member |                                     | empty                                        |
| `routes/api/ingredients/index.ts`     | GET    | none   |                                     | `listIngredients` result                     |
| `routes/api/ingredients/index.ts`     | POST   | member | `ingredientSchema`                  | empty                                        |
| `routes/api/ingredients/[id].ts`      | PUT    | member | `updateIngredientSchema` minus `id` | empty                                        |
| `routes/api/ingredients/[id].ts`      | DELETE | admin  |                                     | empty                                        |
| `routes/api/users/index.ts`           | GET    | admin  | `?status=active\|pending\|blocked`  | `listUsers` result                           |
| `routes/api/users/index.ts`           | POST   | admin  | `userSchema`                        | empty                                        |
| `routes/api/users/[id].ts`            | PATCH  | admin  | `{ status: 'active' \| 'blocked' }` | empty                                        |
| `routes/api/shopping-list/recipes.ts` | GET    | none   | `?ids=[…]`                          | existing selected-recipe projection          |

`/api/session` calls `getApiUser()` and omits its ID, including for the development admin identity.
Auth `/api/auth/*`, image/video streaming (including video HEAD through GET), and health remain
unchanged. Handlers use existing server helpers, including `getRecipeDetails`,
`getSubrecipeInstructions`, `createRecipe`, `updateRecipe` and `deleteRecipe`.

`02.csrf.ts` rejects cross-origin form-encoded API writes except auth; it also covers PUT, PATCH
and DELETE with form or missing content types. Void generates one API/middleware Worker;
the SPA fallback serves only non-file, non-`/api` document paths and never shadows static assets.

### 8.8 Read contract

Recipe list/detail types derive from server query return types. Detail GET resolves the recipe and
embedded sub-recipe instructions together; absent instruction sources are omitted. A missing recipe
is HTTP 404, not successful null data. Palette and shopping-list reads share the central query-key
tree, freshness and invalidation. Query defaults and session identity live in the client-state leaf.

### 8.9 Mutation contract

Recipe create/update/delete invalidates `allRecipes`. Creation and deletion replace navigation
to `/`; update replaces it to `/recipe/<id>`. Back cannot reopen a deleted recipe.
Ingredient create/update/delete invalidates `allIngredients` and `allRecipes`, because recipe and
shopping-list projections embed ingredient names; callers close dialogs after success.
User create/approve/block invalidates `allUsers`, then closes the dialog or stays.
Sign-out uses `location.assign('/auth/login')` without invalidation, resetting the document cache.

### 8.10 Failure and retry boundary

There is no browser write queue or automatic mutation retry. Callers may explicitly resubmit.
Required D1 work resolves before success. HTTP clients throw safe failures; `createForm` converts
400 field-error responses to editable errors and false, while other failures reject for caller alerts.
API errors are not JSON success values.

### 8.11 Contract sketch

```text
queryOptions → readResponse(fetch(GET /api/...)) → query cache → screen
createForm.submit → mutationOptions → guarded API → validation/ownership → D1/R2
                                   → invalidate affected keys → caller close/navigation
```

### 8.12 Outcome and acceptance

- `[SO-1]` The same-origin API supplies every query and mutation with safe typed responses and
  authoritative authorization — demonstrated by `[VC-1]` and `[VC-2]`.
- `[VC-1]` Call every section 8.7 endpoint with sufficient and insufficient production-like identity:
  missing identity returns 401 on guarded writes, insufficient role returns 403, missing recipe
  returns 404, and invalid bodies return 400 dotted field errors before persistence — demonstrates `[SO-1]`.
- `[VC-2]` Recipe writes refresh home/search/detail; ingredient writes refresh catalogue/detail/shopping
  list; user transitions refresh all status panels without reload. Delete replaces navigation home;
  the palette shares recipe-list data, selected-ID queries reflect invalidation, and unknown APIs
  return JSON 404 — demonstrates `[SO-1]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                              | Sections affected   | Reason                                                                       |
| ---------- | -------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| 2026-09-13 | Add the Hono HTTP foundation with request-scoped Drizzle and Better Auth.              | 5, 7, 8.1, 8.7      | Prepare a shared API without migrating feature actions.                      |
| 2026-09-13 | Migrate all feature actions to Hono RPC routes and clients.                            | 2–8                 | Replace `createServerFn` contracts while retaining the same Worker boundary. |
| 2026-09-13 | Move media endpoints into Hono.                                                        | 5, 7, 8.7           | Use one API dispatcher while preserving binary HTTP delivery.                |
| 2026-09-13 | Make Hono the direct Wrangler entry and browser fetch boundary.                        | 3, 5, 7, 8.7        | Remove the file-route and SSR transport adapters.                            |
| 2026-09-13 | Document Hono route groups under `src/server/routes/`.                                 | 4, 7, 8.1, 8.3, 8.5 | Match the server route layout and runtime-specific API placement.            |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts   | Reflect the completed page migration.                                        |
| 2026-10-03 | Submit recipe deletion through the client router with history replacement.             | 8.9, 8.12           | Follow the guarded home redirect without preserving the deleted URL.         |
| 2026-10-04 | Move the client action helper to `page-action.svelte.ts` for Svelte pages.             | 8.9                 | Match the shipped Svelte file conventions.                                   |
