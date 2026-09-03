---
title: Server Functions
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md, docs/infrastructure/client/routing-ssr.spec.md]
---

## 2. Problem Statement

Client routes and forms need a typed RPC boundary that validates untrusted input, applies membership
and ownership policy, performs persistence effects, and refreshes server data predictably. This
leaf refines architecture [PI-2], [PI-3], [PI-4], and the system request lifecycle
(`docs/architecture.spec.md:151-156`).

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                    | Rationale                                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `[KD-1]` RPC declaration          | Feature APIs use TanStack `createServerFn` with GET reads and POST mutations.                             | The application shares typed call contracts between routes and server execution.                 |
| `[KD-2]` Trust sequence           | A protected handler guards, validates, checks row ownership where applicable, then effects writes.        | Rejected requests cannot reach persistence and role-only checks cannot substitute for ownership. |
| `[KD-3]` Form transport           | File-bearing values use `FormData`; scalar and structured values JSON-round-trip through helpers.         | Files retain their binary identity while schemas receive typed structured input.                 |
| `[KD-4]` Error envelope           | Handlers use `withServerError`; router controls pass through and other faults become a French-safe error. | Navigation semantics survive while internal failures do not leak to callers.                     |
| `[KD-5]` Client cache integration | API modules export query or mutation option factories beside their server function.                       | Reads and writes share keys, invalidation, and localized feedback at the feature boundary.       |

## 4. Principles & Intents

- `[PI-1]` **Validate inside the Worker** — refine architecture [PI-3]; client validation is never
  authorization for a write.
- `[PI-2]` **One feature API owns one operation** — feature `api/` modules expose contracts rather
  than routes reaching into persistence.
- `[PI-3]` **Control flow is semantic** — `redirect` and `notFound` retain router meaning; ordinary
  failures have one application envelope.

## 5. Non-Goals

- `[NG-1]` A REST API tier or externally versioned HTTP API, refining architecture [PI-1].
- `[NG-2]` Authorization based only on a browser-provided user identifier.
- `[NG-3]` Binary media streaming through an RPC payload; file routes own that platform surface.

## 6. Caveats

- `[C-1]` A development auth branch supplies a synthetic admin, as recorded in architecture [C-4];
  it cannot demonstrate the OAuth path.
- `[C-2]` Server functions serialize values, so return contracts use serializable data rather than
  Worker objects or streams.
- `[C-3]` R2 effects cannot join D1 batching; write ordering explicitly limits inconsistent states.
- `[C-4]` Route generation is a build artifact, so route-file placement follows the client routing
  specification rather than this leaf.

## 7. High-Level Components

| Component                 | Module type        | Responsibility                                | Public API surface                                |
| ------------------------- | ------------------ | --------------------------------------------- | ------------------------------------------------- |
| Function declaration      | Feature API module | Typed read and mutation RPC                   | `createServerFn` handlers                         |
| Input boundary            | Shared utility     | FormData serialization and parsing            | `objectToFormData`, `parseFormData`               |
| Error boundary            | Shared utility     | Preserve router controls and normalize faults | `withServerError`                                 |
| Authorization composition | Middleware         | Inject active authorized caller               | `authGuard()`                                     |
| Query integration         | Feature API module | Query/mutation options and cache refresh      | `get*Options`, `*Options`                         |
| Binary routes             | File routes        | Delegate media GET/HEAD and auth catch-all    | `/api/image/$id`, `/api/video/$id`, `/api/auth/$` |

## 8. Detailed Design

### 8.1 Function declaration and placement

A read or mutation is declared with `createServerFn`, paired with a validator and handler. Recipe
creation shows POST, `authGuard()`, FormData parsing, and the error wrapper in that order
(`src/features/recipe/api/create.ts:45-53`). Feature API modules export option factories for client
consumption; low-level file routes are reserved for raw binary responses or framework HTTP
handlers.

### 8.2 Validation and FormData contract

`objectToFormData` appends `File` values unchanged, skips nullish values, and JSON-stringifies other
values (`src/utils/form-data.ts:1-11`). `parseFormData` reverses JSON only for parseable string
entries and retains non-string values (`src/utils/form-data.ts:13-28`). A handler passes the parsed
object to its Zod schema before it treats data as domain input.

### 8.3 Authorization and ownership contract

Protected functions compose `authGuard()`; admin-only functions request its admin role variant.
The guard redirects anonymous, blocked, and pending callers, rejects a non-admin at an admin
boundary, and supplies `{ user }` to success paths (`src/lib/auth/auth-guard.ts:6-27`). A handler
that updates or removes a user-owned row also compares row ownership after loading the row; recipe
deletion calls `assertOwnerOrAdmin` before its batch (`src/features/recipe/api/delete.ts:19-40`).

### 8.4 Error contract

`withServerError` rethrows router not-found and redirect controls unchanged
(`src/utils/error-handler.ts:7-9`). Validation failures become an `Invalid Schema` error
(`src/utils/error-handler.ts:11-13`); other failures are logged server-side and expose `Une erreur
est survenue` with the original failure as cause (`src/utils/error-handler.ts:15-21`).

### 8.5 Effects and ordering

A mutation validates and authorizes before it reads or writes. It performs related D1 statements
through data-layer primitives, then executes compensating or object-store effects according to its
feature contract. Recipe deletion batches relational removal before `deleteFile`
(`src/features/recipe/api/delete.ts:40-56`), while creation writes the root then delegates its
ingredient graph (`src/features/recipe/api/create.ts:72-93`).

### 8.6 Query and mutation option contract

Option factories call the bare server function and use `queryKeys` namespaces from the data layer.
A recipe delete mutation invalidates `queryKeys.allRecipes` after success
(`src/features/recipe/api/delete.ts:61-67`). User-facing mutations add localized success and error
feedback in their feature module; client UI state remains outside this cache contract.

### 8.7 API route boundary

The auth route accepts GET and POST and delegates the raw request to `getAuth().handler`
(`src/routes/api/auth/$.ts:6-14`). Media routes delegate to platform R2 helpers. These handlers do
not duplicate feature validation or D1 business logic.

### 8.8 Read contract

A read server function returns a serializable projection suited to its caller and is paired with a
query option whose `queryFn` invokes that function. Route loaders may ensure that option before a
component renders; components observe the same key instead of issuing a parallel ad-hoc request.

Public read access remains a feature-level policy. A function that returns user-scoped or
administrative data composes the guard even when its HTTP method is GET.

### 8.9 Mutation contract

A mutation option passes its variables to the bare server function and invalidates a key only after
that promise resolves. Toast feedback describes the operation in French, while field-level parsing
errors remain attributable to their form input where the client can present them.

Mutation payloads name domain values, not database implementation details. A recipe form carries
its ingredient groups and linked recipes as validated shape; the handler delegates persistence
rather than exposing a sequence of storage calls to the browser.

### 8.10 Failure and retry boundary

A client can retry a failed operation only by invoking its server function again; no browser-side
write queue exists, refining architecture [NG-4]. Handlers avoid reporting success until their
required D1 work has resolved.

A server fault preserves its original cause in the normalized error. Router controls bypass that
normalization because redirect and not-found are expected outcomes with route-owned rendering.

### 8.11 Contract sketch

The meaningful surface is a typed callable and its client options, not a REST resource:
`getRecipe({ data: id }) -> Recipe` and `deleteRecipe({ data: id }) -> void`. Validation and the
guard are part of the callable contract even though callers interact with the concise signature.

## 9. Open Questions

N/A
