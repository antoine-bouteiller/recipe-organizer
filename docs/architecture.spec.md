---
title: Recipe Organizer Architecture
kind: umbrella
status: amended
author: Antoine Bouteiller
date: 2026-08-14
related:
  [
    src/features/recipe/spec/index.spec.md,
    src/features/ingredients/ingredients.spec.md,
    src/features/search/search.spec.md,
    src/features/shopping-list/shopping-list.spec.md,
    src/features/users/users.spec.md,
  ]
---

## 2. Problem Statement

A small, closed group of French-speaking home cooks needs one place to write, find, scale and shop
their recipes, including rich instructions that embed Magimix programs and reusable sub-recipes.
Off-the-shelf recipe apps neither model those instructions nor allow a private, invitation-controlled
membership. Recipe Organizer is a Svelte SPA over a same-origin Void API served from one
Cloudflare deployment, with all state — relational data, blobs, sessions — kept inside one provider
so there is no second service to operate.

- `[G-1]` Serve the whole product — pages, Void HTTP, OAuth callback, and media streaming — from a
  single Cloudflare Worker with no separate API tier.
- `[G-2]` Keep every persistent byte on Cloudflare: relational rows in D1, blobs in R2.
- `[G-3]` Admit users only through Google OAuth plus explicit admin approval, and enforce ownership
  on every write.
- `[G-4]` Give each product domain a self-contained feature module spanning its Void routes, UI,
  and client state.
- `[G-5]` Remain installable through the web manifest and icons, independently of offline support.
- `[G-6]` Present a French-only interface, including validation messages.

## 3. Key Design Decisions

| Decision                          | Choice                                                                                                                                                                        | Rationale                                                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Runtime                  | Static SPA and Void API on one Cloudflare deployment                                                                                                                          | The static shell and API deploy together; no separate deployment needs synchronization.                                                                           |
| `[KD-2]` Render mode              | Static `index.html` mounts Svelte; in-house Navigation API router commits loaded screens                                                                                      | No server data work precedes first paint; code/data preload and cached queries keep visits immediate.                                                             |
| `[KD-3]` Storage                  | D1 for rows, R2 for blobs, both via Worker bindings                                                                                                                           | Bindings need no connection pool or credential rotation, which suits an isolate that may be recycled between requests.                                            |
| `[KD-4]` ORM                      | Drizzle with `defineRelations`                                                                                                                                                | Relational queries stay type-safe end to end, and `batch([...])` supplies the multi-statement atomicity D1 lacks in a single statement.                           |
| `[KD-5]` Identity                 | Google OAuth 2.0 only, encrypted cookie sessions                                                                                                                              | The audience already has Google accounts; storing no passwords removes the largest class of credential liability from the system.                                 |
| `[KD-6]` Membership               | New accounts land `pending` until an admin approves                                                                                                                           | The product is private by intent, and OAuth alone would let any Google account in.                                                                                |
| `[KD-7]` Server-state vs UI-state | TanStack Svelte Query owns server records; persisted rune stores own durable browser intent                                                                                   | Mutations invalidate central keys; persisted IDs/quantities remain device-local rather than stale copies of rows.                                                 |
| `[KD-8]` Image pipeline           | Cloudflare Images transform to WebP 640/q80 before the R2 write                                                                                                               | Paying the transform once at upload keeps R2 small and every read cheap, without a resizing service on the read path.                                             |
| `[KD-9]` Rich instructions        | Lexical with custom nodes                                                                                                                                                     | Magimix programs and sub-recipe references are first-class document nodes, which a Markdown or HTML field cannot represent without a parallel parser.             |
| `[KD-10]` Module boundary         | Features split by runtime: `src/features/<feature>/client/`, `src/features/<feature>/server/`, narrowly shared contracts at the feature root, `src/pages/`, and `routes/api/` | Runtime-specific imports stay isolated while each domain retains clear ownership; feature specs sit at the feature root because they describe both runtime sides. |
| `[KD-11]` PWA registration        | A minimal network-only service worker remains registered at `/sw.js`, without offline support or legacy cleanup                                                               | This is a user requirement for Samsung PWA installation, not a universal browser-installability claim. It provides no offline caching, replay, or fallback.       |

## 4. Principles & Intents

- `[PI-1]` **The Worker owns server execution** — any server-side concern is reachable through Void or a route
  handler; no separate service is introduced.
- `[PI-2]` **Thin feature routes** — validate, touch the database or bucket, return; substantial
  logic moves to feature utilities or `src/lib/server/`.
- `[PI-3]` **Validate at the trust boundary** — every write parses its input with Zod inside its
  Void route, never relying on client-side validation.
- `[PI-4]` **Never duplicate server data in a store** — stores hold identifiers and selections; the
  data behind them lives only in the query cache and comes from API reads.
- `[PI-5]` **Features are self-contained** — cross-feature use goes through a feature's public API,
  not into its internals.
- `[PI-6]` **Design system is owned** — UI primitives live in the repository and are edited in place
  rather than re-pulled from a registry.

## 5. Non-Goals

- `[NG-1]` Public sharing and discovery are outside private-group product intent. Browse APIs are not membership-gated; protected writes and app screens require membership.
- `[NG-2]` Identity providers other than Google, and password or email-link authentication.
- `[NG-3]` Analytical or reporting workloads over D1.
- `[NG-4]` Offline functionality: reads and writes require connectivity; the registered worker has no offline UI, session fallback, precaching, runtime caching, or fallback response.
- `[NG-5]` Localisation beyond French.
- `[NG-6]` Real-time collaboration or multi-user concurrent editing of one recipe.

## 6. Caveats

- `[C-1]` The Worker is stateless and its isolate may be recycled at any point; per-request handles
  such as the database client must not be held across requests.
- `[C-2]` D1 is SQLite: no cross-database joins, limited concurrency, and multi-row atomicity only
  through `batch([...])`.
- `[C-3]` Void route metadata is generated; run `vp exec void prepare` after adding/moving API routes.
- `[C-4]` The development bypass in the auth guard yields a fake admin, so development builds
  exercise no OAuth path.
- `[C-5]` The query cache is in-memory per document, fresh for 5 minutes and retained unused for 24 hours;
  writes invalidate affected keys. The Navigation API router restores document and ScreenLayout scroll
  on traversal; unsupported browsers use full document navigation without client cache continuity.
- `[C-6]` Google's userinfo response shape is an external contract; only `id` and `email` are
  persisted, but a change in that payload breaks sign-in.
- `[C-7]` Session encryption, OAuth client credentials and their rotation are Cloudflare Worker
  secrets; the application cannot function without them being provisioned out of band.

## 7. High-Level Components

```text
Static index.html → src/main.ts → src/app.svelte
  QueryClientProvider → AppHeader + AppMain → pathname-keyed AppError → route screen
        │ Navigation API router · query cache · local intent stores · forms
        │ typed same-origin API queries/mutations
        ▼
Cloudflare Worker: Void API + middleware + ASSETS
        ├─ guarded handlers → server helpers → D1
        ├─ auth → Better Auth / Google
        └─ media → R2 / Images
Manifest/icons · network-only service worker
```

| Component         | Module type          | Responsibility                                             | Public API surface                           |
| ----------------- | -------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| Repository layout | Convention           | Runtime and ownership placement                            | Root adapters, `src/`, and `tools/`          |
| Platform          | Worker configuration | API entry, static fallback, bindings, media/cache, PWA, CI | `void.config.ts`, R2 helpers                 |
| Data layer        | Library              | Drizzle schema, relations, client, migrations              | `getDb()`, schema exports                    |
| Void API          | Library + convention | Queries, mutations, validation and HTTP                    | Named HTTP methods, typed fetch              |
| Auth              | Infrastructure       | Google sessions, status/role enforcement                   | `getApiUser`, `withAuthGuard`, session API   |
| Client routing    | Convention           | Matching, client guards, preload, transitions and scroll   | `routes`, `router`, `preloadLink`            |
| Forms             | Library              | Reactive drafts, server validation and file transport      | `createForm`, controlled fields              |
| Client state      | Library              | Query cache separated from durable intent                  | `queryClient`, `queryKeys`, `persistedStore` |
| Features          | Runtime directories  | Recipe, ingredients, search, shopping list, users          | Components and server helpers                |

Leaf execution order:

| Leaf                                                              | Depends on                       | Rationale                                               |
| ----------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------- |
| [`file-structure`](./file-structure.spec.md)                      | —                                | Names directories and boundaries                        |
| [`infrastructure/server`](./infrastructure/server/server.spec.md) | `file-structure`                 | Runtime, storage, validation, identity                  |
| [`infrastructure/client`](./infrastructure/client/client.spec.md) | `infrastructure/server` `[KD-3]` | Screens, queries, forms and stores use server contracts |

Feature specs remain under `src/features/` and cover each domain across pages, components,
server helpers, and shared schemas rather than implying one shared runtime directory.

## 8. Detailed Design

| Component         | Specified in                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository layout | [`file-structure.spec.md`](./file-structure.spec.md)                                                                                                                                                                                                                                               |
| Platform          | [`infrastructure/server/platform.spec.md`](./infrastructure/server/platform.spec.md)                                                                                                                                                                                                               |
| Data layer        | [`infrastructure/server/data-layer.spec.md`](./infrastructure/server/data-layer.spec.md)                                                                                                                                                                                                           |
| Void API          | [`infrastructure/server/server-functions.spec.md`](./infrastructure/server/server-functions.spec.md)                                                                                                                                                                                               |
| Auth              | [`infrastructure/server/auth.spec.md`](./infrastructure/server/auth.spec.md)                                                                                                                                                                                                                       |
| Client routing    | [`infrastructure/client/routing-ssr.spec.md`](./infrastructure/client/routing-ssr.spec.md)                                                                                                                                                                                                         |
| Forms             | [`infrastructure/client/forms.spec.md`](./infrastructure/client/forms.spec.md)                                                                                                                                                                                                                     |
| Client state      | [`infrastructure/client/client-state.spec.md`](./infrastructure/client/client-state.spec.md)                                                                                                                                                                                                       |
| Feature modules   | [`recipe`](../src/features/recipe/spec/index.spec.md), [`ingredients`](../src/features/ingredients/ingredients.spec.md), [`search`](../src/features/search/search.spec.md), [`shopping-list`](../src/features/shopping-list/shopping-list.spec.md), [`users`](../src/features/users/users.spec.md) |

### 8.1 Request lifecycle

Non-file, non-`/api` document paths receive the same static `index.html`, with no session lookup,
D1 read or SSR before first paint. `src/main.ts` loads shared CSS, sets the French Zod locale and
mounts `src/app.svelte`: QueryClientProvider wraps AppHeader (search/theme) and AppMain, with
pathname-keyed AppError around the current route component.

The in-house router in `src/lib/client/router/` owns a pattern/access/component/preload registry.
It ensures `['session']`, chooses screens through client guards, and awaits lazy code and
`ensureQueryData` preloads before committing. Cached stale records commit immediately and refresh
in the background. Header/tab links and home cards preload on viewport; search cards preload on
intent. Server records live only in the TanStack Svelte Query cache, with 5-minute staleTime and
24-hour gcTime; persisted stores hold only IDs/quantities/preferences. Local-only shopping-list
selection precedes its query. Existing mount/snapshot compatibility paths are always-client.

All data reaches the browser through `/api/**`; protected APIs independently authorize.
Unknown document paths render in-app NotFound with HTTP 200, while static assets remain intact
and unknown API paths return JSON 404. Missing recipes return API 404 with in-page recovery.

### 8.2 Write lifecycle

Feature `src/features/<feature>/client/api/<operation>.ts` exports query/mutation options using
`readResponse(fetch(...))` from `void/client`. Forms use app-owned `createForm`, sending JSON
unless a nested File requires bracket-key multipart. API handlers validate and authorize before
domain writes; recipe helpers check owner-or-admin. Invalid write bodies return
`400 { error, errors }` with dotted field paths; other failures retain safe errors and French alerts.

Mutation success invalidates `allRecipes` for recipe writes; `allIngredients` and `allRecipes`
for ingredient writes; `allUsers` for user writes. Callers await mutations and choose dialog/reset
or navigation effects. Recipe create/delete uses `router.navigate('/', { replace: true })`;
update replaces navigation to `/recipe/<id>`, so Back cannot reopen deleted recipes.
Sign-out reloads `/auth/login`, resetting the cache. D1 batching and R2 effect ordering remain
feature-owned. Client guards choose screens only; the Worker remains the authorization boundary.

### 8.3 Trust boundary

Membership state, role, ownership and input shape are all decided inside the Worker. A guard resolves
the session before any handler body runs; handlers that mutate user-owned rows additionally compare
the row's owner with the caller unless the caller is an admin. Blob keys are random UUIDs, so
possession of a URL is never a capability derived from guessing.

## 9. Open Questions

- `[OQ-1]` Whether a growing recipe corpus warrants moving search off D1 `LIKE` scans onto a
  dedicated index — owner: @antoine

## Changelog

| Date       | Amendment                                                              | Sections affected   | Reason                                                                        |
| ---------- | ---------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| 2026-09-12 | Use 640px WebP q80 uploads.                                            | 3                   |                                                                               |
| 2026-09-13 | Move feature actions to Hono RPC routes and clients.                   | 2, 3, 4, 7, 8.1–8.2 | Keep feature transport in the shared Worker while replacing server functions. |
| 2026-09-13 | Move to a browser SPA and direct Worker API entry.                     | 2, 3, 7, 8.1        | Remove Start SSR and server-action architecture.                              |
| 2026-09-13 | Split feature ownership across client, server, and shared directories. | 2, 3, 4, 7, 8       | Separate runtime code while preserving one package and Cloudflare deployment. |
| 2026-09-13 | Rename the server feature directory to `routes`.                       | 3                   | Match the server route layout.                                                |
| 2026-09-14 | Register a network-only PWA worker while retaining offline removal.    | 2–3, 5, 7           | Meet the Samsung installation requirement without restoring offline behavior. |
| 2026-09-18 | Align query loading with optional prefetch and inline skeletons.       | 8.1                 | Reflect the current TanStack Query API and page-owned loading.                |

| 2026-10-02 | Root the Void app and package Worker implementation as `server`. | 3, 7–8 | Keep one deployment with explicit source-package boundaries. |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration. |
| 2026-10-03 | Document hydrated browsing, client navigation, prefetch, and redirecting deletion. | 2–3, 6–8 | Reflect the completed navigation migration. |
| 2026-10-04 | Migrate the UI runtime from React to Svelte 5 (`@void/svelte`); persisted stores become rune stores. | 2, 8 | Match the shipped Svelte file/API conventions. |
