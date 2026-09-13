---
title: Hono Feature API
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md, docs/infrastructure/client/routing-ssr.spec.md]
---

## 2. Problem Statement

Client routes and forms need a typed Hono RPC boundary that validates untrusted input, applies
membership and ownership policy, performs persistence effects, and refreshes server data predictably. This
leaf refines architecture [PI-2], [PI-3], [PI-4], and the system request lifecycle
(`docs/architecture.spec.md:151-156`).

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                | Rationale                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `[KD-1]` RPC declaration          | Feature APIs expose Hono GET reads and POST mutations; `hc` supplies their typed clients.             | One route contract serves native same-origin browser fetches without server-action serialization. |
| `[KD-2]` Trust sequence           | A protected route guards, validates, checks row ownership where applicable, then effects writes.      | Rejected requests cannot reach persistence and role-only checks cannot substitute for ownership.  |
| `[KD-3]` Wire transport           | JSON carries scalar values and multipart `FormData` carries files; route schemas validate wire input. | Files retain their binary identity while schemas receive typed structured input.                  |
| `[KD-4]` Error envelope           | `readResponse` maps HTTP failures to Router controls or a safe application error.                     | Navigation semantics survive while internal failures do not leak to callers.                      |
| `[KD-5]` Client cache integration | Feature API modules export query or mutation option factories beside their RPC client calls.          | Reads and writes share keys, invalidation, and localized feedback at the feature boundary.        |

## 4. Principles & Intents

- `[PI-1]` **Validate inside the Worker** — refine architecture [PI-3]; client validation is never
  authorization for a write.
- `[PI-2]` **One feature API owns one route group** — `src/server/routes/<feature>/routes.ts` modules expose
  contracts rather than routes reaching into another feature's persistence.
- `[PI-3]` **Control flow is semantic** — HTTP `401`, membership `403`, and `404` become Router
  controls; ordinary failures have one application error envelope.

## 5. Non-Goals

- `[NG-1]` A separately deployed API tier; Hono feature routes share the existing Worker entry,
  refining architecture [PI-1].
- `[NG-2]` Authorization based only on a browser-provided user identifier.
- `[NG-3]` Binary media streaming through an RPC payload; Hono media routes return raw HTTP responses.

## 6. Caveats

- `[C-1]` A development auth branch supplies a synthetic admin, as recorded in architecture [C-4];
  it cannot demonstrate the OAuth path.
- `[C-2]` Hono RPC crosses an HTTP boundary, so route contracts use JSON or multipart data rather
  than Worker objects or streams.
- `[C-3]` R2 effects cannot join D1 batching; write ordering explicitly limits inconsistent states.
- `[C-4]` Route generation is a build artifact, so route-file placement follows the client routing
  specification rather than this leaf.

## 7. High-Level Components

| Component                 | Module type                         | Responsibility                                    | Public API surface                         |
| ------------------------- | ----------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| Route declaration         | Server `routes/<feature>/routes.ts` | Typed read and mutation HTTP RPC                  | Hono GET/POST routes                       |
| Schema boundary           | Feature API module                  | Validate JSON, query, params, and multipart input | Zod schemas, `zValidator`, `parseFormData` |
| Error boundary            | Shared API client                   | Map HTTP statuses to Router controls and errors   | `readResponse`                             |
| Authorization composition | Hono middleware                     | Inject active authorized caller                   | `authGuard()`                              |
| Query integration         | Feature API module                  | Query/mutation options and cache refresh          | `apiClient`, `get*Options`, `*Options`     |
| API handler               | Worker entry + Hono                 | Dispatch API, auth, and media requests            | `/api/*`                                   |

## 8. Detailed Design

### 8.1 Function declaration and placement

A feature owns `src/server/routes/<feature>/routes.ts` for its Hono route group and small
query/mutation wrapper files in `src/client/features/<feature>/api/` for client consumption.
Reads use GET; writes use POST and compose `authGuard()` before `zValidator`.
The recipe group demonstrates multipart parsing, ownership checks, media effects, and graph writes
(`src/server/routes/recipe/routes.ts:45-203`). Schemas live separately in `src/shared/<feature>/schemas.ts`.

### 8.2 Validation and FormData contract

JSON routes validate their body with `zValidator('json', schema)`. Multipart recipe routes validate
the wire form, parse it with `parseFormData`, then validate the domain shape. The browser preserves
`File` values in `FormData`; scalar structured values JSON-round-trip through the helper
(`src/shared/utils/form-data.ts:1-28`).

### 8.3 Authorization and ownership contract

Protected routes compose `authGuard()`; admin-only routes request its admin role variant. The guard
returns HTTP authorization failures and supplies `{ user }` to success paths. A route that updates
or removes a user-owned row also compares row ownership after loading the row; recipe deletion calls
`assertOwnerOrAdmin` before its batch (`src/server/routes/recipe/routes.ts:177-201`).

### 8.4 Error contract

The API returns route-owned HTTP statuses and `{ error }` failures. `readResponse` maps `401` to the
login redirect, membership `403` to the corresponding login outcome, and `404` to Router `notFound`;
other failures become `Invalid Schema` for `400` or the safe server error (`src/client/lib/api-client.ts:26-46`).

### 8.5 Effects and ordering

A mutation validates and authorizes before it reads or writes. It performs related D1 statements
through data-layer primitives, then executes compensating or object-store effects according to its
feature contract. Recipe deletion batches relational removal before `deleteFile`; creation writes
the root then delegates its ingredient graph (`src/server/routes/recipe/routes.ts:111-201`).

### 8.6 Query and mutation option contract

Option factories call the typed `apiClient` and use `queryKeys` namespaces from the data layer. A
mutation invalidates its affected key only after a successful response. User-facing mutations add
localized feedback in their feature module; client UI state remains outside this cache contract.

### 8.7 API route boundary

`src/server/index.ts` is the Wrangler entry: its default export provides `fetch`, which creates
the request-scoped Drizzle and Better Auth services before calling the module-level Hono app
(`src/server/index.ts:7-18`). `src/server/api.ts` mounts ingredient, recipe, shopping-list, and user
route groups, Better Auth at `/api/auth/*`, the session endpoint, and public image and video
endpoints. It applies CSRF protection after auth, so non-auth feature routes are protected while the
Better Auth protocol passes through unchanged (`src/server/api.ts:14-43`). Cloudflare runs the Worker
first for `/api` and `/api/*`; browser routes remain SPA asset requests.

`apiClient` is an `hc<typeof api>` client using native same-origin `fetch` with credentials in the
browser (`src/client/lib/api-client.ts`). It has no SSR bridge or server-side in-process transport.

`GET /api/health` is a liveness check. Unmatched requests return `404 { "error": "not_found" }`; Zod,
HTTP, and unexpected failures receive the API error envelope. Hono serves `GET /api/image/:id`
and `GET /api/video/:id` through platform R2 helpers, preserving streamed bodies and cache headers.
Video `HEAD` selects the R2 HEAD helper inside the GET handler because Hono dispatches HEAD through
GET; it returns metadata without reading the object body. These are plain HTTP endpoints, not RPC payloads.

### 8.8 Read contract

A GET route returns a JSON projection suited to its caller and is paired with a query option whose
`queryFn` invokes the typed Hono client. Route loaders may ensure that option before a component
renders; components observe the same key instead of issuing a parallel ad-hoc request. Public read
access remains a feature-level policy; user-scoped and administrative reads compose the guard.

HTTP dates are ISO strings: the user-list wrapper revives `createdAt` and `updatedAt` to `Date`
instances. Routes that use `null` as an HTTP absence value convert it to the existing client contract
where needed: the session and recipe-instructions wrappers expose `undefined`
(`src/client/features/users/api/get-all.ts:8-21`, `src/client/features/recipe/api/get-instructions.ts:6-18`).

### 8.9 Mutation contract

A mutation option passes variables to the typed Hono client and invalidates a key only after a
successful response. Toast feedback describes the operation in French, while field-level parsing
errors remain attributable to their form input where the client can present them.

Mutation payloads name domain values, not database implementation details. A recipe form carries
its ingredient groups and linked recipes as validated shape; the handler delegates persistence
rather than exposing a sequence of storage calls to the browser.

### 8.10 Failure and retry boundary

A client can retry a failed operation only by invoking its Hono RPC mutation again; no browser-side
write queue exists, refining architecture [NG-4]. Routes avoid reporting success until their required
D1 work has resolved. `204 No Content` writes resolve as `void`.

Server faults expose only the API error envelope. The response helper translates authorization and
not-found statuses into Router controls, preserving route-owned rendering.

### 8.11 Contract sketch

The meaningful surface is a typed Hono RPC route and its client options, for example
`GET /api/recipes/:id -> Recipe` and `POST /api/recipes/delete -> 204`. Validation and the guard are
part of the route contract even though callers interact through concise feature wrappers.

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
