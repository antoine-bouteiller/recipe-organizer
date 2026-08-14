---
title: Recipe Organizer Architecture
kind: umbrella
status: implemented
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
membership. Recipe Organizer is a single isomorphic React application served from one Cloudflare
Worker, with all state — relational data, blobs, sessions — kept inside one provider so there is no
second service to operate.

- `[G-1]` Serve the whole product — pages, RPC, OAuth callback, media streaming — from a single
  Cloudflare Worker with no separate API tier.
- `[G-2]` Keep every persistent byte on Cloudflare: relational rows in D1, blobs in R2.
- `[G-3]` Admit users only through Google OAuth plus explicit admin approval, and enforce ownership
  on every write.
- `[G-4]` Give each product domain a self-contained feature module that owns its server functions,
  UI and client state.
- `[G-5]` Work offline as an installable PWA for browsing already-visited content.
- `[G-6]` Present a French-only interface, including validation messages.

## 3. Key Design Decisions

| Decision                          | Choice                                                             | Rationale                                                                                                                                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Runtime                  | TanStack Start on one Cloudflare Worker                            | One TypeScript codebase covers document rendering, RPC and HTTP handlers; the Worker is the API, so there is no second deployment target to keep in sync.                                                                   |
| `[KD-2]` Render mode              | Client-only routes, SSR limited to the root shell                  | Every page is personalised and auth-dependent, so server-rendered page HTML is never shareable; rendering only the shell removes hydration mismatch as a class of bug and lets `localStorage`-backed state render directly. |
| `[KD-3]` Storage                  | D1 for rows, R2 for blobs, both via Worker bindings                | Bindings need no connection pool or credential rotation, which suits an isolate that may be recycled between requests.                                                                                                      |
| `[KD-4]` ORM                      | Drizzle with `defineRelations`                                     | Relational queries stay type-safe end to end, and `batch([...])` supplies the multi-statement atomicity D1 lacks in a single statement.                                                                                     |
| `[KD-5]` Identity                 | Google OAuth 2.0 only, encrypted cookie sessions                   | The audience already has Google accounts; storing no passwords removes the largest class of credential liability from the system.                                                                                           |
| `[KD-6]` Membership               | New accounts land `pending` until an admin approves                | The product is private by intent, and OAuth alone would let any Google account in.                                                                                                                                          |
| `[KD-7]` Server-state vs UI-state | TanStack Query owns server data; TanStack Store owns UI selections | The two have different lifetimes and invalidation rules; keeping them disjoint stops persisted UI state from going stale against the database.                                                                              |
| `[KD-8]` Image pipeline           | Cloudflare Images transform to WebP 1024/q80 before the R2 write   | Paying the transform once at upload keeps R2 small and every read cheap, without a resizing service on the read path.                                                                                                       |
| `[KD-9]` Rich instructions        | Lexical with custom nodes                                          | Magimix programs and sub-recipe references are first-class document nodes, which a Markdown or HTML field cannot represent without a parallel parser.                                                                       |
| `[KD-10]` Module boundary         | One directory per feature owning `api/`, `components/`, state      | Feature-local ownership keeps a change to one domain inside one directory and makes the spec tree mirror the code tree.                                                                                                     |
| `[KD-11]` Offline                 | Serwist service worker for shell and asset caching                 | The kitchen is a poor-connectivity environment; caching the shell and already-fetched assets keeps a consulted recipe readable without network.                                                                             |

## 4. Principles & Intents

- `[PI-1]` **The Worker is the API** — any server-side concern is reachable as a server function or a
  route handler; no separate service is introduced.
- `[PI-2]` **Thin server functions** — validate, touch the database or bucket, return; substantial
  logic moves to `src/lib/`.
- `[PI-3]` **Validate at the trust boundary** — every write parses its input with Zod inside the
  server function, never relying on client-side validation.
- `[PI-4]` **Never duplicate server data in a store** — stores hold identifiers and selections; the
  data behind them is refetched by query.
- `[PI-5]` **Features are self-contained** — cross-feature use goes through a feature's public API,
  not into its internals.
- `[PI-6]` **Design system is owned** — UI primitives live in the repository and are edited in place
  rather than re-pulled from a registry.

## 5. Non-Goals

- `[NG-1]` Public or anonymous access to recipes; every route is behind approved membership.
- `[NG-2]` Identity providers other than Google, and password or email-link authentication.
- `[NG-3]` Analytical or reporting workloads over D1.
- `[NG-4]` Offline mutation: writes require connectivity; the service worker serves reads only.
- `[NG-5]` Localisation beyond French.
- `[NG-6]` Real-time collaboration or multi-user concurrent editing of one recipe.

## 6. Caveats

- `[C-1]` The Worker is stateless and its isolate may be recycled at any point; per-request handles
  such as the database client must not be held across requests.
- `[C-2]` D1 is SQLite: no cross-database joins, limited concurrency, and multi-row atomicity only
  through `batch([...])`.
- `[C-3]` The generated route tree is a build artefact, so adding or moving a route file requires a
  dev-server restart.
- `[C-4]` The development bypass in the auth guard yields a fake admin, so development builds
  exercise no OAuth path.
- `[C-5]` The shopping-list query key contains the selected recipe identifiers, so each selection
  change mints a new key and refetches; this holds at tens of entries, not thousands.
- `[C-6]` Google's userinfo response shape is an external contract; only `id` and `email` are
  persisted, but a change in that payload breaks sign-in.
- `[C-7]` Session encryption, OAuth client credentials and their rotation are Cloudflare Worker
  secrets; the application cannot function without them being provisioned out of band.

## 7. High-Level Components

```text
                    ┌───────────────────────── Cloudflare Worker ─────────────────────────┐
   Browser          │                                                                     │
   ┌──────────┐     │   ┌────────────┐   ┌──────────────────┐   ┌────────────────────┐    │
   │ Router   │────▶│   │ Root shell │──▶│ Server functions │──▶│ Data layer         │───▶│──▶ D1
   │ Query    │ RPC │   │ + auth     │   │ (validate/guard) │   │ (Drizzle schema)   │    │
   │ Store    │     │   └────────────┘   └──────────────────┘   └────────────────────┘    │
   │ Forms    │     │          │                   │                                      │
   └──────────┘     │          │                   └──────────────▶ media handlers ───────│──▶ R2 / Images
        │           │          └──────────────────────────────────▶ OAuth exchange ───────│──▶ Google
   ┌──────────┐     └─────────────────────────────────────────────────────────────────────┘
   │ Serwist  │
   └──────────┘
```

| Component         | Module type            | Responsibility                                                         | Public API surface                                               |
| ----------------- | ---------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Repository layout | Convention             | Where each kind of module lives and what may import what               | Directory contract under `src/`                                  |
| Platform          | Worker configuration   | Worker entry, bindings, edge cache, media handlers, service worker, CI | `wrangler.jsonc` bindings, `src/lib/{r2,cache-manager}.ts`       |
| Data layer        | Library                | Drizzle schema, relations, per-request client, migrations              | `getDb()`, table and relation exports                            |
| Server functions  | Library + convention   | Validated, guarded RPC and its query/mutation option factories         | `createServerFn` handlers, `*Options()` factories, `authGuard()` |
| Auth              | Feature-adjacent infra | Google OAuth exchange, encrypted sessions, role and status enforcement | `getAuthUser()`, `authGuard()`, auth routes                      |
| Routing & SSR     | Convention             | File-based routes, route context, loaders, render-mode boundaries      | Route tree, `beforeLoad` context                                 |
| Forms             | Library                | Single application form hook over TanStack Form, Zod and Base UI       | `useAppForm`, `withForm`, field components                       |
| Client state      | Library                | Persisted UI state stores and their layering against server state      | `src/stores/*`, `persistedStore`                                 |
| Feature modules   | Feature directories    | Recipe, ingredients, search, shopping list and users domains           | Per-feature `api/` and components                                |

Leaf execution order:

| Leaf                                                              | Depends on                       | Rationale                                                        |
| ----------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| [`file-structure`](./file-structure.spec.md)                      | —                                | Names the directories every other spec places code into          |
| [`infrastructure/server`](./infrastructure/server/server.spec.md) | `file-structure`                 | Owns the runtime, storage, RPC and identity the client builds on |
| [`infrastructure/client`](./infrastructure/client/client.spec.md) | `infrastructure/server` `[KD-3]` | Routing, forms and stores consume the server contracts           |

Feature modules are specified beside their code and refine this umbrella through `related:` rather
than owning any section of it.

## 8. Detailed Design

| Component         | Specified in                                                                                                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository layout | [`file-structure.spec.md`](./file-structure.spec.md)                                                                                                                                                                                                                                               |
| Platform          | [`infrastructure/server/platform.spec.md`](./infrastructure/server/platform.spec.md)                                                                                                                                                                                                               |
| Data layer        | [`infrastructure/server/data-layer.spec.md`](./infrastructure/server/data-layer.spec.md)                                                                                                                                                                                                           |
| Server functions  | [`infrastructure/server/server-functions.spec.md`](./infrastructure/server/server-functions.spec.md)                                                                                                                                                                                               |
| Auth              | [`infrastructure/server/auth.spec.md`](./infrastructure/server/auth.spec.md)                                                                                                                                                                                                                       |
| Routing & SSR     | [`infrastructure/client/routing-ssr.spec.md`](./infrastructure/client/routing-ssr.spec.md)                                                                                                                                                                                                         |
| Forms             | [`infrastructure/client/forms.spec.md`](./infrastructure/client/forms.spec.md)                                                                                                                                                                                                                     |
| Client state      | [`infrastructure/client/client-state.spec.md`](./infrastructure/client/client-state.spec.md)                                                                                                                                                                                                       |
| Feature modules   | [`recipe`](../src/features/recipe/spec/index.spec.md), [`ingredients`](../src/features/ingredients/ingredients.spec.md), [`search`](../src/features/search/search.spec.md), [`shopping-list`](../src/features/shopping-list/shopping-list.spec.md), [`users`](../src/features/users/users.spec.md) |

### 8.1 Request lifecycle

A page request reaches the Worker, whose root route resolves the session cookie and theme cookie into
the route context `{ authUser, queryClient, theme, isAdmin }`, then returns the document shell. The
client router takes over: the matched route's loader prefetches through
`queryClient.ensureQueryData(...)`, which calls the feature's server function over RPC; that handler
runs its guard, parses its input, reads D1 and returns serialisable data. Store-backed UI state is
read directly from `localStorage` on the same pass, since no server render of the page exists to
diverge from.

### 8.2 Write lifecycle

A form submission serialises to `FormData`, a mutation invokes the feature's server function, and the
handler runs guard → validator → blob write → row writes, in that order, so a rejected input never
reaches storage. On success the mutation invalidates the affected query keys, raises a toast and lets
the router navigate; on failure the error surfaces as a single French message and the form maps field
errors back onto their inputs.

### 8.3 Trust boundary

Membership state, role, ownership and input shape are all decided inside the Worker. A guard resolves
the session before any handler body runs; handlers that mutate user-owned rows additionally compare
the row's owner with the caller unless the caller is an admin. Blob keys are random UUIDs, so
possession of a URL is never a capability derived from guessing.

## 9. Open Questions

- `[OQ-1]` Whether a growing recipe corpus warrants moving search off D1 `LIKE` scans onto a
  dedicated index — owner: @antoine
