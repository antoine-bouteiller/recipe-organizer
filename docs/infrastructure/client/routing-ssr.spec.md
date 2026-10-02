---
title: Routing and Islands
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

Every URL needs a server-rendered document, predictable access gates, and data ready for rendering.
Void Pages owns matching, loaders, actions, and layouts; feature components retain domain presentation.
Browsing ships static HTML with focused islands, while editing and administration retain hydrated client navigation.

## 3. Key Design Decisions

| Decision                     | Choice                                                                                            | Rationale                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Route declaration   | Void file pages and colocated `.server.ts` loaders/actions under `pages/`.                        | One URL owns its server input and mutation boundary.                                                      |
| `[KD-2]` Data lifecycle      | Loaders read `@/features/*/server/*` directly; actions refresh loader props.                      | No browser query cache or duplicate HTTP read is needed for page data.                                    |
| `[KD-3]` Render mode         | `(browse)` has an island layout; `(app)` has a regular hydrated layout.                           | Browsing needs JavaScript only for interactive controls; Void forbids regular pages under island layouts. |
| `[KD-4]` Navigation feedback | Void client view transitions for regular pages; cross-document transitions for island navigation. | Navigation remains native without transition support; backward traversals get a `back` transition type.   |

## 4. Principles & Intents

- `[PI-1]` **Compose, do not own domain logic** — loaders and actions call server helpers; pages wire feature components.
- `[PI-2]` **Gates precede screens** — protected loaders return `guardPage` redirects before reading protected data; writes enforce their own authorization.
- `[PI-3]` **URLs are input** — server loaders/actions parse dynamic IDs and read search values before use.
- `[PI-4]` **Use actual navigation links** — Button `asLink` with `href` renders `@void/react` `Link`; navigation policy stays app-owned.

## 5. Non-Goals

- `[NG-1]` Browser-only authorization or a separate application mount.
- `[NG-2]` A public cache policy for personalised document responses.
- `[NG-3]` A client query cache or offline navigation; see [client state](./client-state.spec.md).

## 6. Caveats

- `[C-1]` Run `vp exec void prepare` after page/API route changes to regenerate ignored route types.
- `[C-2]` Inner scroll-container restoration is not managed. The retained scroll IDs do not supply restoration; island back navigation relies on browser bfcache.
- `[C-3]` The head config progressively registers a network-only `/sw.js`; registration failure does not block rendering and no offline fallback exists.
- `[C-4]` Local development always resolves an active admin identity, so it does not prove anonymous or non-admin behavior.

## 7. High-Level Components

| Component         | Module type                        | Responsibility                                           | Public API surface                          |
| ----------------- | ---------------------------------- | -------------------------------------------------------- | ------------------------------------------- |
| Browse layout     | `pages/(browse)/layout.island.tsx` | Static shell with desktop-only search/theme islands      | `useShared()`, children                     |
| App layout        | `pages/(app)/layout.tsx`           | Hydrated shell, French Zod locale, render-error boundary | `AppErrorBoundary`, children                |
| Page components   | `pages/**/*.tsx`                   | Compose loader props and feature slots                   | Default page export                         |
| Server companions | `pages/**/*.server.ts`             | Reads, gates, mutations                                  | `loader`, `action`, `actions`, `InferProps` |
| Page context      | `middleware/03.page-context.ts`    | Request identity and navigation path                     | `{ authUser, pathname }`                    |
| API handlers      | `routes/api/**`                    | Remaining HTTP, auth, health, media                      | Named HTTP methods                          |

## 8. Detailed Design

### 8.1 Pages and shared context

Void generates the Worker entry from `pages/**`, `routes/api/**`, and global `middleware/**`.
`vite.config.ts` uses `voidReact({ react: { compiler: true }, viewTransitions: true })` alongside
`voidPlugin` and `appType: 'mpa'`. One dev server on port 3000 serves rendered pages and the API.

`03.page-context.ts` excludes API and file-extension paths, resolves `getApiUser(context)`, and sets
`shared = { authUser: user ? { email, role } : null, pathname }`. Layouts use `useShared()` to
mark navigation; pages use identity only for affordances, not write authorization.
The resolver memoizes its promise per request and forwards Better Auth session response cookies.

### 8.2 Page contract

| Group      | Layout              | URLs                                                                                                                            |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `(browse)` | `layout.island.tsx` | `/`, `/search`, `/shopping-list`, `/recipe/[id]`                                                                                |
| `(app)`    | `layout.tsx`        | `/auth/login`, `/settings`, `/settings/account`, `/settings/ingredients`, `/settings/users`, `/recipe/new`, `/recipe/edit/[id]` |

Route groups do not add URL segments. Browsing pages export default components from
`*.island.tsx`; regular pages use `*.tsx`. Server companions export `defineHandler` loaders and
`InferProps<typeof loader>` types. Home and search read `listRecipes(getDb())`; recipe details
read the recipe and embedded sub-recipe instructions in the loader. Shopping-list data depends on
localStorage, so its server companion sets `prerender = false` for request-dependent header identity
rather than supplying recipe props.

### 8.3 Access and URL parsing

Protected settings and editor loaders call `guardPage(context)` and return its `Response` before
data reads. Anonymous visitors redirect to `/auth/login`; blocked/pending users redirect to
`/auth/login?error=account_blocked` or `account_pending`. The users loader requests `'admin'`;
a non-admin redirects to `/settings`. The login loader redirects any resolved identity to `/`.
Browse loaders do not require membership. The editor gates entry but its mutation helpers still
enforce owner-or-admin checks. A missing or invalid recipe ID returns `recipe: null` for in-page
`NotFound`, including on the edit page.

### 8.4 Screen and layout boundary

Both layouts compose `AppHeader` and `AppMain`. Browse header search and theme controls are islands
that hydrate only at the header's desktop breakpoint, `media:(min-width: 768px)`; the regular layout hydrates its shell, loads the French Zod locale, and wraps children in
`AppErrorBoundary` keyed by pathname. The browse layout has no equivalent app render-error boundary.

Island imports must be relative: nearby `_name.tsx` modules default-re-export components and pages
import them with `with { island: 'load' }`, `'idle'`, or `'media:(…)'`. The reset-shopping-list
wrapper owns its small button directly. Features expose slots/render props, such as
`renderCardAction`, `quantityControls`, and `renderIngredientGroups`, so pages attach islands without
feature-to-feature imports. Pages retain unstyled composition; feature and app-shell owners retain CSS.

### 8.5 Errors, HTTP, and navigation

Unknown URLs use Void's default 404. An in-app catch-all page is deliberately absent: it shadowed
static assets such as `/manifest.json`. Missing recipes instead render DS `NotFound` within the page.
The regular layout handles client render errors with French recovery text, a home link, and
development-only Error details; server loader failures are not handled by that React boundary.
`01.api-errors.ts` maps thrown page-action errors as well as API errors to JSON `{ error }`.

Regular pages use Void client navigation; island pages navigate across documents. Shared CSS enables
`@view-transition { navigation: auto }`; `void.config.ts` adds a `pagereveal` listener that marks
backward traversal transitions with the `back` type when Navigation API activation is available.
Unsupported browsers retain ordinary navigation.

DS Button uses `asLink` + `href` and optional `viewTransition` with the actual Void `Link`.
`TabBar` takes `currentPath` and items with `href`; `isCurrentPath` matches home exactly and other
items at their path or descendants. Desktop navigation follows the same matcher.
`Tabs` are native hash anchors; once hydrated their click handler scrolls the panel and calls
`history.replaceState`, avoiding extra history entries. Static tabs retain native hash behavior.
`ScreenLayout` takes a `backButton` slot; DS `GoBackButton` defaults to `history.back()` and is
passed as an island on recipe details. Storybook needs no router decorator.

### 8.6 Route contract summary

| Concern            | Page-owned shape                      | Consumer                                 |
| ------------------ | ------------------------------------- | ---------------------------------------- |
| Shared context     | `{ authUser, pathname }`              | `useShared()`                            |
| URL input          | Parsed params and request query       | Loader/action                            |
| Data readiness     | Direct server read → loader props     | Default page component                   |
| Local-only loading | Hydration gate + Suspense             | Shopping-list island skeleton            |
| Access             | `guardPage` redirect Response         | Protected loader/action                  |
| Mutation           | `action` or named `actions`           | `usePageAction()` or direct island fetch |
| HTTP endpoint      | Typed same-origin `void/client` fetch | Remaining API consumers                  |

### 8.7 Render-boundary rules

Loaders read server data, not browser storage, and do not perform mutations. Actions validate and
authorize writes. Regular-page clients call `usePageAction()`, which submits POST through
`submitAction` with `preserveState: true`, keeps the URL/history entry, refreshes page props in place,
alerts expected failure, and resolves a success boolean. Never await an action inside a React transition:
submission owns the asynchronous refresh lifecycle. Callers choose subsequent navigation or dialog closing.

Recipe deletion is the island exception: its management control posts `fetch('/recipe/<id>', { method: 'POST' })`
without the client router, alerts a failed HTTP response, and navigates home on success. The guarded
page action deletes the recipe and returns a home redirect.

Persisted stores return their initial snapshot for SSR and hydration, then switch to saved localStorage
values. `useIsHydrated()` keeps the shopping-list skeleton visible until device-local selection can
be read. This avoids treating unknown server-side browser intent as an empty shopping list.

### 8.8 Outcome and acceptance

- `[SO-1]` Browsing and editing share server-rendered URLs with distinct hydration budgets — demonstrated by `[VC-1]`.
- `[SO-2]` Server gates and page mutations retain access policy and refresh semantics — demonstrated by `[VC-2]`.
- `[VC-1]` Hard-load each URL in section 8.2: content renders; browse controls hydrate without mismatch;
  an unknown URL returns the default 404 and `/manifest.json` remains an asset — demonstrates `[SO-1]`.
- `[VC-2]` With production-like identities, protected loaders redirect anonymous/inactive/non-admin
  callers appropriately; a successful regular-page action updates props without an action URL/history entry,
  and missing recipes show in-page recovery — demonstrates `[SO-2]`.

## 9. Open Questions

N/A

## Changelog

| Date       | Amendment                                                                              | Sections affected | Reason                                                                     |
| ---------- | -------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------- |
| 2026-09-13 | Route the API catch-all through Hono RPC while retaining media route handlers.         | 7, 8.5, 8.7       | Reflect the migrated API adapter boundary.                                 |
| 2026-09-13 | Dispatch media through the API catch-all.                                              | 7, 8.5            | Give all API endpoints the same Hono boundary.                             |
| 2026-09-13 | Replace SSR and file-route API adapters with the browser SPA and Worker entry.         | 2–3, 7–8          | Make browser routing and direct Hono dispatch explicit.                    |
| 2026-09-16 | Document Base UI render composition with the actual router Link.                       | 4, 8.5            | Preserve routing behavior without bespoke native-anchor adapters.          |
| 2026-09-18 | Move reusable router-only presentation into the design system.                         | 4, 8.4–8.5        | Keep typed links and router behavior in DS while app routes retain policy. |
| 2026-09-18 | Keep routes as unstyled composition of feature sections and the app shell.             | 8.4–8.5           | Colocate presentation and styles without moving routing contracts.         |
| 2026-09-18 | Document optional query prefetch and inline isLoading skeletons.                       | 8.2–8.4, 8.6–8.7  | Match current query APIs and page-owned loading feedback.                  |
| 2026-09-19 | Inline single-use desktop navigation and error rendering in their app owners.          | 8.4–8.5           | Remove unused DS abstractions while retaining typed links and safe errors. |
| 2026-09-28 | Replace Base UI render composition with Button `asLink`.                               | 4, 8.5            | Base UI is no longer a dependency.                                         |
| 2026-10-02 | Document Void Pages loaders/actions, islands, and current navigation/state boundaries. | Updated contracts | Reflect the completed page migration.                                      |
