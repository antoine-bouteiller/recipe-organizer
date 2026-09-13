---
title: Routing and SPA
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/client/client.spec.md
related:
  [
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/client/client-state.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
    docs/infrastructure/server/platform.spec.md,
  ]
---

## 2. Problem Statement

Browser navigation needs typed URLs, predictable access gates, and data available when a screen
renders. The route layer coordinates those concerns with browser application chrome and Worker contracts
without becoming a feature data layer.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                     | Rationale                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Route declaration   | File routes declare matching, context gates, parameter/search parsing, and loader prefetch | Co-locating navigation concerns gives each URL one typed contract while feature query factories retain data ownership.                                       |
| `[KD-2]` Query lifecycle     | A router-scoped `QueryClient` is provided explicitly through `QueryClientProvider`         | A single browser cache supports intent preloading and avoids a second fetch at render; the provider replaces the SSR-query bridge (`src/client/router.tsx`). |
| `[KD-3]` Browser application | `index.html` and `src/client/main.tsx` mount the Router and page chrome in the browser     | No document shell is rendered by the Worker; cross-cutting browser state is resolved through route and React context.                                        |
| `[KD-4]` Navigation feedback | Router links use view-transition support and route resolution owns back/forward direction  | Navigation remains native when transitions are unsupported, while supported browsers receive direction-aware motion (`src/client/router.tsx:42-49`).         |

## 4. Principles & Intents

- `[PI-1]` **Compose, do not own data** — refine `client.spec.md` `[PI-2]`: loaders call feature
  query options and components consume those same options.
- `[PI-2]` **Gates precede screens** — authentication and role redirects occur in route lifecycle,
  with Worker enforcement remaining authoritative under `../../architecture.spec.md` `[PI-3]`.
- `[PI-3]` **URLs are typed input** — path parameters and search values parse before a screen uses
  them.

## 5. Non-Goals

- `[NG-1]` Authorization decisions in browser routes; this refines `client.spec.md` `[KD-2]`.
- `[NG-2]` A public cache policy for personalised document responses.
- `[NG-3]` Feature-specific query keys or mutation behavior; those belong to feature APIs and
  [`./client-state.spec.md`](./client-state.spec.md).

## 6. Caveats

- `[C-1]` The generated route tree follows route-file names; a route declaration whose path differs
  from its file is invalid.
- `[C-2]` Intent preloading runs loaders before an explicit navigation, so loaders remain
  idempotent and read-only.
- `[C-3]` Service-worker registration is progressive: the root catches registration failure and
  continues rendering (`src/client/routes/__root.tsx:25-39`).

## 7. High-Level Components

| Component      | Module type                         | Responsibility                                                           | Public API surface               |
| -------------- | ----------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| Browser entry  | `index.html`, `src/client/main.tsx` | Mount the browser SPA and Router                                         | application mount                |
| Router factory | `src/client/router.tsx`             | Create route context, query cache, matching defaults, and Query provider | `getRouter()`                    |
| Root route     | `src/client/routes/__root.tsx`      | Render application-wide browser chrome and outlet                        | root `Route` context             |
| Page routes    | `src/client/routes/**/*.tsx`        | Parse URL state, gate entry, prefetch feature queries, render screens    | `createFileRoute()` declarations |
| API handler    | `src/server/index.ts`               | Serve Hono API, auth, and media requests                                 | Worker `fetch`, `/api/*`         |

## 8. Detailed Design

### 8.1 Router and root context

`index.html` loads `src/client/main.tsx`, which mounts the browser application. `getRouter()` creates a
`QueryClient`, explicitly wraps the router in `QueryClientProvider`, and registers the generated
route tree with `defaultPreload: 'intent'`, root not-found handling, and scroll restoration
(`src/client/router.tsx`). This browser provider replaces the former SSR-query bridge. The root route
provides application chrome and the outlet; it does not resolve a Worker request or render an HTML
document shell. Both query and mutation caches handle Router redirect errors through the same
callback, preserving login redirects for expired sessions and blocked or pending accounts.

### 8.2 Page-route contract

A page route declares its file-route path, optional `beforeLoad` gate, optional Zod
`validateSearch`, and a loader that awaits `context.queryClient.ensureQueryData(options)`. The home
route demonstrates validated search input and list prefetch (`src/client/routes/index.tsx:70-83`); dynamic
routes parse their segment and return typed loader data for the component. A settings route redirects
unauthenticated navigation before screen render (`src/client/routes/settings.tsx:3-9`).

Routes render screens and select layouts; feature components own the content. A route consumes
`useSuspenseQuery(options)` only after its loader has populated the matching options. Public routes
remain readable where the feature permits it, and UI affordances derive from route context rather
than replacing Worker checks.

### 8.3 Access and URL parsing

A route that requires membership throws a redirect from `beforeLoad`; the settings layout supplies
that gate to its descendant settings screens (`src/client/routes/settings.tsx:3-9`). A public route omits
that redirect and uses route context only to choose presentation affordances. Admin-only navigation
uses an additional role gate at the matching route, while Worker handlers make the final access
decision under [`../server/auth.spec.md`](../server/auth.spec.md).

Search state is parsed through a route-local Zod schema. Invalid input fails before the screen
receives it; valid output is the sole search-state surface for that screen. Dynamic segments follow
the same rule: parse the path parameter in the loader, prefetch with the parsed identifier, and
return the typed identifier as loader data. URL strings therefore never become implicit feature IDs.

### 8.4 Screen and layout boundary

The browser entry owns application mounting; the router provider owns the query context. The root
route owns application chrome, desktop navigation, offline feedback, and the outlet. A page route
owns screen selection, pending UI, and its route-specific layout inputs. Feature components own
recipe cards, editors, settings controls, and all domain presentation. This division lets a layout
consume route context without importing a feature's private API.

A route may supply a pending component for its loader. Pending UI communicates that the screen is
waiting for its query contract; it does not substitute a second cache or invoke a write. Error and
not-found rendering remain router-level surfaces so a failed match has one consistent recovery UI.

### 8.5 Errors, HTTP, and navigation

The router supplies the root error and not-found surfaces (`src/client/router.tsx:39-52`). The Worker entry's `fetch` dispatches `/api/*` directly to the shared Hono API, which owns feature,
authentication, session, health, and media responses. Hono media handlers delegate binary reads to
platform R2 helpers. Each handler preserves the response shape, headers, and redirects owned by its
contract; browser page routes do not wrap it.

Forward links request view transitions; the router determines back navigation from history indexes
(`src/client/router.tsx:42-49`). The interaction remains a normal navigation when the browser lacks view
transition support. Scroll restoration targets the screen containers configured by the router
(`src/client/router.tsx:51-54`), so screen layouts identify their scrollable regions rather than managing
history manually.

### 8.6 Route contract summary

| Concern        | Route-owned shape                           | Consumer                        |
| -------------- | ------------------------------------------- | ------------------------------- |
| Context        | `{ authUser, queryClient, theme, isAdmin }` | `Route.useRouteContext()`       |
| Search         | `validateSearch(input) -> typed output`     | `Route.useSearch()`             |
| Dynamic path   | loader parses segment and returns data      | `Route.useLoaderData()`         |
| Data readiness | `ensureQueryData(options)`                  | matching feature query hook     |
| Access         | `beforeLoad` redirect                       | router navigation lifecycle     |
| HTTP endpoint  | Worker `fetch` → Hono `/api/*`              | browser or external HTTP client |

### 8.7 Render-boundary rules

The browser entry is the application boundary: it mounts the Router and query provider. A feature
screen reads browser state only within its matched page route. This keeps application-wide chrome
at the root while keeping screen-specific work colocated with the URL that needs it.

A loader may read through a query option and return URL-derived values. It does not submit a form,
write browser persistence, or perform a mutation. A component may render from loader data and the
query cache, then delegates writes to the form and Hono RPC contracts. These boundaries make
intent preloading safe: visiting a link intent can populate a cache without causing a side effect.

A route's pending UI represents the same screen shape as its resolved UI where practical. It does
not disclose data that the route gate would withhold. Redirects abort the route path before its
loader and component become the active screen, so a protected feature does not need a separate
render-time access fallback.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                      | Sections affected | Reason                                                  |
| ---------- | ------------------------------------------------------------------------------ | ----------------- | ------------------------------------------------------- |
| 2026-09-13 | Route the API catch-all through Hono RPC while retaining media route handlers. | 7, 8.5, 8.7       | Reflect the migrated API adapter boundary.              |
| 2026-09-13 | Dispatch media through the API catch-all.                                      | 7, 8.5            | Give all API endpoints the same Hono boundary.          |
| 2026-09-13 | Replace SSR and file-route API adapters with the browser SPA and Worker entry. | 2–3, 7–8          | Make browser routing and direct Hono dispatch explicit. |
