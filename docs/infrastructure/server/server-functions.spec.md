---
title: Void Feature API
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md, docs/infrastructure/client/routing-ssr.spec.md]
---

## 2. Problem Statement

Client routes and forms need a typed Void RPC boundary that validates untrusted input, applies
membership and ownership policy, performs persistence effects, and refreshes server data predictably. This
leaf refines architecture [PI-2], [PI-3], [PI-4], and the system request lifecycle
(`docs/architecture.spec.md`, section 8.1).

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                | Rationale                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `[KD-1]` RPC declaration          | Void file routes export GET reads and POST mutations; `void/client` supplies typed `fetch`.           | One route contract serves native same-origin browser fetches without server-action serialization. |
| `[KD-2]` Trust sequence           | A protected route guards, validates, checks row ownership where applicable, then effects writes.      | Rejected requests cannot reach persistence and role-only checks cannot substitute for ownership.  |
| `[KD-3]` Wire transport           | JSON carries scalar values and multipart `FormData` carries files; route schemas validate wire input. | Files retain their binary identity while schemas receive typed structured input.                  |
| `[KD-4]` Error envelope           | `readResponse` maps HTTP failures to Router controls or a safe application error.                     | Navigation semantics survive while internal failures do not leak to callers.                      |
| `[KD-5]` Client cache integration | Feature API modules export query or mutation option factories beside their RPC client calls.          | Reads and writes share keys, invalidation, and localized feedback at the feature boundary.        |

## 4. Principles & Intents

- `[PI-1]` **Validate inside the Worker** — refine architecture [PI-3]; client validation is never
  authorization for a write.
- `[PI-2]` **One feature API owns one route group** — `routes/api/<feature>/` modules expose
  contracts rather than routes reaching into another feature's persistence.
- `[PI-3]` **Control flow is semantic** — HTTP `401`, membership `403`, and `404` become Router
  controls; ordinary failures have one application error envelope.

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
- `[C-4]` Void generates API route types in `.void/routes.d.ts`; run
  `vp exec void prepare` before checks on a clean tree. TanStack browser routes and Void
  API routes use separate directories and generators.

## 7. High-Level Components

| Component                 | Module type                  | Responsibility                                    | Public API surface                                       |
| ------------------------- | ---------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Route declaration         | Void `routes/api/<feature>/` | Typed read and mutation HTTP RPC                  | Void GET/POST routes                                     |
| Schema boundary           | Feature API module           | Validate JSON, query, params, and multipart input | Zod, `defineHandler.withValidator`, `readRecipeFormData` |
| Error boundary            | Shared API client            | Map HTTP statuses to Router controls and errors   | `readResponse`                                           |
| Authorization composition | Handler wrapper              | Inject active authorized caller                   | `withAuthGuard(handler, role?)`                          |
| Query integration         | Feature API module           | Query/mutation options and cache refresh          | `readResponse(fetch(...))`, `get*Options`, `*Options`    |
| API handler               | Generated Worker + Void      | Dispatch API, auth, and media requests            | `/api/*`                                                 |

## 8. Detailed Design

### 8.1 Function declaration and placement

A feature owns file routes under `routes/api/<feature>/` and small query/mutation wrappers
in `src/features/<feature>/api/`. Route files export named methods such as
`export const GET = defineHandler(...)`; reads use GET and mutations use POST, including
`POST /api/recipes/update` and `POST /api/recipes/delete`. Shared schemas live in
`packages/shared/src/<feature>/schemas.ts`; domain persistence helpers live in `packages/server/src/<feature>/`.

### 8.2 Validation and FormData contract

JSON, query, and path input use `defineHandler.withValidator({ body | query | params })` with shared
Zod schemas. Guarded routes wrap the validated handler so authorization runs before validation.
The body slot reads JSON, not multipart input: recipe create/update handlers call
`readRecipeFormData(context)` and parse the result with `recipeSchema` or `updateRecipeSchema`.
The browser sends `FormData` unchanged, preserving `File` values while structured scalar values
JSON-round-trip through the shared form-data helper.

### 8.3 Authorization and ownership contract

Protected routes use `withAuthGuard(handler, role?)` from `packages/server/src/lib/auth/auth-guard.ts`;
admin-only routes pass `'admin'`. The wrapper authorizes before the handler and its validators,
then sets `apiUser` in the context, read through `context.get('apiUser')` on success paths; Void reserves `user` for its own integration.
Failures throw `HTTPException`: `401 unauthorized`, `403 account_blocked`,
`403 account_pending`, or `403 Permission denied`. Handlers that update or remove user-owned rows
also load the row and call `assertOwnerOrAdmin` before persistence.

### 8.4 Error contract

Global `middleware/01.api-errors.ts` normalizes API failures through
`toApiErrorResponse` and `toApiValidationResponse` in `packages/server/src/lib/api-error.ts`:

| Failure                                     | HTTP response                                                                      |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `HTTPException`                             | Its status and `{ error }`: its message, or `'Une erreur est survenue'` when empty |
| Thrown `ZodError` or Void validator failure | `400 { error: 'Invalid Schema; …' }`                                               |
| Unknown API path                            | `404 { error: 'not_found' }`                                                       |
| Unexpected error                            | Logged server-side; `500 { error: 'Une erreur est survenue' }`                     |

`readResponse(requestPromise)` catches `FetchError` from `void/client`: `401` redirects to
`/auth/login`; membership `403` redirects there with the corresponding `error` search value;
`404` throws Router `notFound()`; `400` becomes `Invalid Schema`; other HTTP failures use
the JSON `error` message. Non-HTTP failures propagate unchanged.

### 8.5 Effects and ordering

A mutation validates and authorizes before it reads or writes. It performs related D1 statements
through data-layer primitives, then executes compensating or object-store effects according to its
feature contract. Recipe deletion batches relational removal before `deleteFile`; creation writes
the root then delegates its ingredient graph (`routes/api/recipes/index.ts`, `routes/api/recipes/delete.ts`).

### 8.6 Query and mutation option contract

Option factories call typed `fetch` from `void/client` through `readResponse` and use `queryKeys` namespaces from the data layer. A
mutation invalidates its affected key only after a successful response. User-facing mutations add
localized feedback in their feature module; client UI state remains outside this cache contract.

### 8.7 API route boundary

Void generates the Worker entry from `routes/api/**` and global middleware under
`middleware/`. Routes import `getDb()`, `getAuth()`, and media helpers directly from
`packages/server/src/` (`@recipe-organizer/server/*`); services are not injected into the request environment.
`02.csrf.ts` applies `hono/csrf` to `/api/*` except `/api/auth/*`, whose origin checks belong
to Better Auth. The Worker handles every request, including assets, and serves browser navigations
through the SPA fallback described in the platform leaf.

The browser calls same-origin `fetch` from `void/client`, typed by the generated `RouteMap` from
`void/routes`, for example `readResponse(fetch('/api/recipes/:id', { params: { id } }))`.
There is no SSR bridge or in-process transport; output types in `src/types/` derive from
`RouteMap`.

`GET /api/health` is a liveness check. Image and video routes delegate to R2 helpers, preserving
binary bodies and cache headers. Void dispatches video HEAD through GET; the handler selects the
R2 HEAD helper to return metadata without reading the object body.

### 8.8 Read contract

A GET route returns a JSON projection suited to its caller and is paired with a query option whose
`queryFn` invokes the typed Void `fetch`. Route loaders may ensure that option before a component
renders; components observe the same key instead of issuing a parallel ad-hoc request. Public read
access remains a feature-level policy; user-scoped and administrative reads compose the guard.

HTTP dates are ISO strings: the user-list wrapper revives `createdAt` and `updatedAt` to `Date`
instances. Routes that use `null` as an HTTP absence value convert it to the existing client contract
where needed: the session and recipe-instructions wrappers expose `undefined`
(`src/features/users/api/get-all.ts`, `src/features/recipe/api/get-instructions.ts`).
The session and recipe-instructions handlers use `jsonNullable` to return JSON `null` with status
200 instead of Void's default 204 for a returned `null`.

### 8.9 Mutation contract

A mutation option passes variables to the typed Void `fetch` and invalidates a key only after a
successful response. Failures raise a French `alert()` describing the operation, while field-level parsing
errors remain attributable to their form input where the client can present them.

Mutation payloads name domain values, not database implementation details. A recipe form carries
its ingredient groups and linked recipes as validated shape; the handler delegates persistence
rather than exposing a sequence of storage calls to the browser.

### 8.10 Failure and retry boundary

A client can retry a failed operation only by invoking its Void HTTP mutation again; no browser-side
write queue exists, refining architecture [NG-4]. Routes avoid reporting success until their required
D1 work has resolved. `204 No Content` writes resolve as `void`.

Server faults expose only the API error envelope. The response helper translates authorization and
not-found statuses into Router controls, preserving route-owned rendering.

### 8.11 Contract sketch

The meaningful surface is a typed Void HTTP route and its client options, for example
`GET /api/recipes/:id -> Recipe` and `POST /api/recipes/delete -> 204`. Validation and the guard are
part of the route contract even though callers interact through concise feature wrappers.

### 8.12 Outcome and acceptance

- `[SO-1]` Feature calls use a generated, typed same-origin HTTP contract with stable authorization,
  validation, and optional-read semantics — demonstrated by `[VC-1]` and `[VC-2]`.
- `[VC-1]` Given a guarded endpoint, an anonymous request receives JSON 401 before input validation;
  blocked/pending members receive their JSON 403 code; invalid authorized input receives JSON 400
  without persistence effects — demonstrates `[SO-1]`.
- `[VC-2]` Given no session or no recipe instructions, GET returns status 200 with JSON `null`;
  an unknown API path returns JSON `404 { error: 'not_found' }`. Successful feature writes invalidate
  their query-key family — demonstrates `[SO-1]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                 | Sections affected   | Reason                                                                       |
| ---------- | ------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| 2026-09-13 | Add the Hono HTTP foundation with request-scoped Drizzle and Better Auth. | 5, 7, 8.1, 8.7      | Prepare a shared API without migrating feature actions.                      |
| 2026-09-13 | Migrate all feature actions to Hono RPC routes and clients.               | 2–8                 | Replace `createServerFn` contracts while retaining the same Worker boundary. |
| 2026-09-13 | Move media endpoints into Hono.                                           | 5, 7, 8.7           | Use one API dispatcher while preserving binary HTTP delivery.                |
| 2026-09-13 | Make Hono the direct Wrangler entry and browser fetch boundary.           | 3, 5, 7, 8.7        | Remove the file-route and SSR transport adapters.                            |
| 2026-09-13 | Document Hono route groups under `src/server/routes/`.                    | 4, 7, 8.1, 8.3, 8.5 | Match the server route layout and runtime-specific API placement.            |
