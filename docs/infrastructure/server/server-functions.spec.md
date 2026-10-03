---
title: Void Pages and Feature API
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/auth.spec.md, docs/infrastructure/client/routing-ssr.spec.md]
---

## 2. Problem Statement

Pages and forms need a typed Worker boundary that validates untrusted input, applies membership
and ownership policy, performs persistence effects, and refreshes server data. Void page loaders
read server helpers directly; page actions own page mutations; a small API remains for browser-only
data, auth, health, and media. This refines architecture [PI-2], [PI-3], and [PI-4].

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                     | Rationale                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `[KD-1]` Declaration         | Pages export loaders and actions; remaining API files export HTTP methods.                 | Page data need not make a duplicate HTTP request; APIs serve independent browser consumers. |
| `[KD-2]` Trust sequence      | Protected handlers authorize, validate, check ownership where applicable, then write.      | UI gates cannot authorize persistence.                                                      |
| `[KD-3]` Wire transport      | Actions accept typed body entries including files; API POST uses JSON where needed.        | Shared schemas validate structured inputs at the Worker.                                    |
| `[KD-4]` Error envelope      | API and thrown action failures share JSON `{ error }`; clients provide redirects/alerts.   | Internal faults remain safe application messages.                                           |
| `[KD-5]` Refresh integration | `usePageAction()` refreshes regular-page props with URL/history and local state preserved. | No query-option factories or cache invalidation are required.                               |

## 4. Principles & Intents

- `[PI-1]` **Validate inside the Worker** — client validation never authorizes writes.
- `[PI-2]` **Page owns its mutation** — server companions compose domain helpers; APIs remain only for independent HTTP consumers.
- `[PI-3]` **Control flow is semantic** — page gates return redirects, API status codes remain HTTP errors, and ordinary failures share a safe envelope.

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
- `[C-4]` Void generates page/action/API types in `.void/`; run `vp exec void prepare` after route changes and before clean-tree checks.

## 7. High-Level Components

| Component            | Module type                     | Responsibility                             | Public API surface                                       |
| -------------------- | ------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Server companion     | `pages/**/*.server.ts`          | Page reads, gates, mutations               | `loader`, `action`, `actions`, `InferProps`              |
| Schema boundary      | Page/API handler                | Validate body, query, params, file entries | Zod, `defineHandler.withValidator`, `readRecipeFormData` |
| Client action helper | `src/lib/client/page-action.ts` | In-place refresh and failure alert         | `usePageAction()`                                        |
| Response helper      | `src/lib/client/api-client.ts`  | Safe HTTP errors and login navigation      | `readResponse`, `getErrorMessage`                        |
| Authorization        | Server auth helpers             | Gate page reads and protect writes         | `guardPage`, `withAuthGuard`                             |
| API handlers         | `routes/api/**`                 | Remaining HTTP contracts                   | Named GET/POST exports                                   |

## 8. Detailed Design

### 8.1 Function declaration and placement

Void pages live under `pages/` with server companions exporting `defineHandler` loaders and
`action` or named `actions`. They import domain reads/writes from `@/features/<feature>/server/*`.
Shared schemas live at the `src/features/<feature>/` root; server persistence helpers live in
`src/features/<feature>/server/`. Browser components receive loader props rather than importing
Worker-bound helpers at runtime.

### 8.2 Validation and FormData contract

JSON/query/params use `defineHandler.withValidator` and shared Zod schemas. Recipe forms serialize
with `objectToFormData`, convert to entries for `usePageAction`, and server actions call
`readRecipeFormData` before `recipeSchema`/`updateRecipeSchema` parsing. That reader accepts
Void action bodies as well as multipart requests; files remain raw while other structured values
JSON-round-trip. Edit actions verify the body ID matches the page ID.

### 8.3 Authorization and ownership contract

Protected loaders return `guardPage(context, role?)` redirects before data reads.
Recipe create/edit actions repeat that gate. Settings actions and recipe deletion wrap handlers in
`withAuthGuard(handler, role?)`, which authorizes before handler validation and sets `apiUser`.
Missing identity throws JSON 401; inactive membership throws its JSON 403 code; an admin requirement
failure throws 403. Recipe write/delete helpers independently check owner-or-admin authorization.

### 8.4 Error contract

`middleware/01.api-errors.ts` maps thrown API errors and errors from non-GET page requests through
`toApiErrorResponse`. API-only validator responses also pass through `toApiValidationResponse`.

| Failure           | HTTP response                                                  |
| ----------------- | -------------------------------------------------------------- |
| `HttpError`       | Its status and `{ error }` message                             |
| Thrown `ZodError` | 400 schema error envelope                                      |
| Unknown API path  | `404 { error: 'not_found' }`                                   |
| Unexpected error  | Logged server-side; `500 { error: 'Une erreur est survenue' }` |

`readResponse` catches typed `FetchError`: 401 uses `location.assign('/auth/login')`;
blocked/pending 403 adds the login error query; 400 becomes `Invalid Schema`; other statuses,
including 404 and ordinary permission 403, throw safe Errors rather than page-control exceptions.
Non-HTTP failures propagate unchanged. `usePageAction` also describes validation `errors` records
returned by action submission and alerts an unsuccessful result.

### 8.5 Effects and ordering

Actions validate/authorize before effects and delegate aggregate writes to server helpers.
D1 batching and R2 ordering follow the feature/data-layer contracts. Recipe deletion uses
`src/features/recipe/server/recipe-delete.ts`; create/update use `recipe-mutations.ts`.
R2 cannot participate in a D1 batch.

### 8.6 Page-action client contract

`usePageAction()` submits typed action URLs, body data, and required dynamic params through
`submitAction(router, url, { data, method: 'POST', preserveState: true })`. It preserves URL/history,
refreshes props in place, alerts expected failures, and returns `Promise<boolean>`.
Callers own navigation/reset/close after success. Never await an action inside a React transition.
The DS `DeleteDialog` uses local loading state while awaiting its callback.

### 8.7 API route boundary

The remaining routes are:

| Route                            | Consumer                                         |
| -------------------------------- | ------------------------------------------------ |
| `/api/auth/*`                    | Void auth (Better Auth) sign-in/session protocol |
| `/api/image/*`, `/api/video/*`   | Media reads; video HEAD handled through GET      |
| `GET /api/health`                | Liveness                                         |
| `GET /api/recipes`               | Header search palette, fetched on first open     |
| `GET /api/shopping-list/recipes` | IDs selected in localStorage                     |
| `POST /api/ingredients`          | Inline `AddIngredient`; then `router.refresh()`  |

API clients use same-origin typed `void/client` fetch through `readResponse`.
`02.csrf.ts` rejects cross-origin form-encoded requests (Origin / Sec-Fetch-Site) only to `/api/*` except auth; it does not wrap page-action URLs.
Void generates one Worker from pages, API routes, and middleware; its asset serving and default 404
remain intact without an application catch-all.

### 8.8 Read contract

Loaders return serializable props typed with `InferProps`. Recipe list/detail types derive from
server query return types; no separate query-option layer exists. Missing detail recipes use
`recipe: null`; embedded instructions resolve in the detail loader and absent sources are omitted.

The header palette retains a stable promise per document, initialized on first open.
Shopping-list reads retain one promise per serialized ID selection; rejected promises are removed.
These browser-only reads have no timed freshness or mutation invalidation lifecycle.

### 8.9 Mutation contract

Regular-page forms submit page actions, then use refreshed props and caller-owned UI effects.
Recipe deletion calls `submitAction(router, '/recipe/<id>', { method: 'POST', replace: true })`
from `void/pages-client`. The guarded action deletes the aggregate and redirects home; replacement
keeps Back from reopening the deleted recipe. It bypasses `usePageAction()` because `preserveState`
keeps the old URL on redirects. Failed results alert via `alertError`.

Inline ingredient creation uses the remaining API POST; success awaits `router.refresh()` before
form reset and dialog closing. Settings ingredient update/delete use page actions.

### 8.10 Failure and retry boundary

There is no browser write queue or automatic mutation retry. Callers may explicitly resubmit.
Required D1 work resolves before success. `usePageAction` reports unsuccessful results as false;
HTTP clients throw safe errors. Loader errors remain server responses, not API JSON success values.

### 8.11 Contract sketch

`loader(context) -> props | redirect Response`;
`action(context) -> result | redirect Response`.
For example, `/search` returns `{ recipes }` from a direct D1 read and
`/recipe/edit/[id]` validates an action body before replacing the aggregate.
`GET /api/recipes -> ReducedRecipe[]` remains an independent palette read.

### 8.12 Outcome and acceptance

- `[SO-1]` Direct loader reads and guarded page actions replace page-specific HTTP clients while
  remaining APIs preserve safe typed responses — demonstrated by `[VC-1]` and `[VC-2]`.
- `[VC-1]` A protected loader redirects before reading data; a guarded action/API rejects missing,
  inactive, or insufficient-role callers and invalid authorized input before persistence — demonstrates `[SO-1]`.
- `[VC-2]` An in-place page write refreshes its props without changing URL/history; the palette fetches
  on opening, shopping-list reads selected IDs, and an unknown API returns JSON 404 — demonstrates `[SO-1]`.

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
