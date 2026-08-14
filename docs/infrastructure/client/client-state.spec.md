---
title: Client State
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/client/client.spec.md
related:
  [
    docs/infrastructure/client/routing-ssr.spec.md,
    docs/infrastructure/client/forms.spec.md,
    docs/infrastructure/server/data-layer.spec.md,
    docs/infrastructure/server/server-functions.spec.md,
    docs/infrastructure/server/auth.spec.md,
  ]
---

## 2. Problem Statement

The browser holds server records, durable personal selections, navigable URL values, and ephemeral
interaction state with different owners and lifetimes. A clear placement rule prevents stale copies
of Worker-owned data while preserving responsive, device-local interactions.

## 3. Key Design Decisions

| Decision                        | Choice                                                                                 | Rationale                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `[KD-1]` Server records         | TanStack Query owns data returned by Worker contracts                                  | Cache invalidation and refetch remain possible because server data has one browser representation; this refines `client.spec.md` `[PI-1]`. |
| `[KD-2]` Query identity         | Feature query options use central `queryKeys` helpers                                  | Stable keys make prefetch and invalidation address the same resource; key families are defined in `src/lib/query-keys.ts:1-13`.            |
| `[KD-3]` Durable UI state       | TanStack Store persists data-only, user-controlled selections through `persistedStore` | Small ID- and preference-shaped stores survive reload without copying server entities.                                                     |
| `[KD-4]` Shareable state        | Route search schemas own bookmarkable and history-sensitive values                     | URL state participates in browser navigation and validates at the route boundary.                                                          |
| `[KD-5]` SSR-visible preference | Theme uses an isomorphic cookie and root route context                                 | The document shell can select its theme before feature screens render (`src/lib/theme.ts:1-13`; `src/routes/__root.tsx:83-93`).            |

## 4. Principles & Intents

- `[PI-1]` **One source per value** — refine `client.spec.md` `[PI-1]`: a value belongs to query,
  URL, cookie, store, local component state, or feature context, not several layers.
- `[PI-2]` **Persist intent, not records** — durable stores contain identifiers, quantities, and
  preferences; queries resolve the current records.
- `[PI-3]` **Context stays local** — React context serves a single feature subtree; route context
  serves cross-cutting route values.

## 5. Non-Goals

- `[NG-1]` A global store containing server records; this refines `client.spec.md` `[NG-1]`.
- `[NG-2]` Session tokens or authorization state in a browser store; those remain under
  `../server/auth.spec.md`.
- `[NG-3]` Durable storage for transient control state such as hover, dialog visibility, or a draft
  interaction.

## 6. Caveats

- `[C-1]` Browser storage can be unavailable or contain malformed values. `persistedStore` guards
  storage access and falls back to the supplied initial value (`src/lib/persisted-store.ts:3-22`).
- `[C-2]` Query cache freshness is five minutes and garbage collection is one day, so a visible
  screen can require invalidation after a successful write (`src/router.tsx:23-30`).
- `[C-3]` A selection-derived query key changes when selection changes; it suits compact user
  selections rather than unbounded collections.

## 7. High-Level Components

| Component              | Module type                   | Responsibility                                        | Public API surface                          |
| ---------------------- | ----------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| Query cache            | Router integration            | Cache Worker-owned records and loader prefetch        | `QueryClient`, feature `*Options()`         |
| Query keys             | `src/lib/query-keys.ts`       | Name query resource families                          | `queryKeys`                                 |
| Persisted stores       | `src/stores/*.store.ts`       | Hold durable user selections and quantities           | selector hooks and action functions         |
| Persistence adapter    | `src/lib/persisted-store.ts`  | Hydrate and write a data-only Store                   | `persistedStore<T>()`                       |
| Route and cookie state | Routes and `src/lib/theme.ts` | Represent shareable values and SSR-visible preference | `validateSearch`, `getTheme`, `toggleTheme` |
| Feature context        | `src/features/*/contexts/*`   | Thread a value through one feature subtree            | feature provider and hook                   |

## 8. Detailed Design

### 8.1 Placement rule

A database-backed value uses a feature query option and TanStack Query. A value intended for a link,
bookmark, or back/forward navigation uses a route search schema. A user-controlled value that must
survive reload on one device uses a persisted store. A value required by the document shell uses an
isomorphic cookie and route context. A short-lived control value uses component state; a deeply
shared feature-only value uses feature context.

### 8.2 Query cache and routing

`getRouter()` creates the QueryClient, supplies it through route context, and installs the router
query bridge (`src/router.tsx:23-60`). A loader awaits `ensureQueryData(options)` and its screen
consumes the same options through `useSuspenseQuery` or `useQuery`; the home route is the reference
prefetch shape (`src/routes/index.tsx:70-83`). Mutations invalidate the affected `queryKeys` family
so subsequent readers obtain Worker-owned state.

### 8.3 Persisted selection and derived data

A store file exports a selector hook plus action functions over a data-only Store. The shopping-list
store, for example, persists only recipe IDs and exposes add, remove, and reset operations
(`src/stores/shopping-list.store.ts:1-12`). The shopping-list hook reads those IDs and quantities,
then queries recipes with an IDs-derived query option before aggregation
(`src/features/shopping-list/hooks/use-shopping-list.ts:23-39`). It therefore retains no copy of
recipe records in local persistence.

### 8.4 Persistent-store contract

`persistedStore<T>(key, initial)` reads storage when the browser provides it, constructs a Store from
the recovered value or initial value, and serialises each subsequent state update
(`src/lib/persisted-store.ts:3-22`). Store state is data only: actions are exported functions that
call `setState`, rather than functions embedded in the persisted state. A selector hook is the public
read surface, allowing a component to subscribe to precisely the state it displays.

A persisted store holds a value that is personal, device-local, and useful after reload. Suitable
examples include selected recipe IDs, overridden quantities, and recently opened IDs. It does not
hold a computed shopping-list result, a query response, a session, or a dialog's open flag. Those
values have different invalidation, security, or lifetime semantics.

| State question                          | Placement                           | Reason                                              |
| --------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| Is the Worker the source of truth?      | Query cache                         | Invalidation and refetch preserve record freshness. |
| Is it part of a navigable URL?          | Route search state                  | Links and history retain the value.                 |
| Is it an SSR-visible preference?        | Isomorphic cookie and route context | The document shell can read it.                     |
| Is it durable, personal browser intent? | Persisted Store                     | Device-local data survives reload.                  |
| Is it a short interaction?              | Component state                     | No cross-screen or durable ownership exists.        |
| Does one feature subtree need it?       | Feature context                     | It avoids unrelated global wiring.                  |

### 8.5 Invalidation and mutation boundary

A feature mutation calls its server-function contract and, on success, invalidates the query key
family representing the affected records. Components do not patch a parallel Store copy of a recipe,
ingredient, or user. Query options and their keys identify the data relationship, so a loader,
component, and mutation all address the same cache entry.

The selection-to-query pattern is intentionally two-stage: store hooks produce IDs, a feature query
option accepts those IDs, and the feature derives display data from the returned records. The
shopping-list hook follows that arrangement (`src/features/shopping-list/hooks/use-shopping-list.ts:23-39`).
An empty selection remains a valid query input and a screen determines its empty presentation.

### 8.6 Cookie, URL, local, and feature state

The root resolves the cookie-backed theme with authentication context before rendering its document
shell (`src/routes/__root.tsx:83-93`). Routes validate search input and expose the typed result to
their screens (`src/routes/index.tsx:70-83`). Components keep ephemeral interaction state locally.
A feature provider is appropriate only when a value must cross a deep subtree within that feature.

Cookie state uses the same getter/setter boundary on the server and in the browser. Theme resolution
falls back to the system preference when the cookie has no value (`src/lib/theme.ts:1-13`). Session
cookies remain in the server authentication contract, not in this state layer. Route context carries
resolved cross-cutting values through matched routes and avoids a second global Context.

Feature context has a narrow scope: a provider and consumer live under the feature that owns their
value. It does not expose a substitute application state layer. A consumer outside the provider uses
the feature's documented fallback rather than relying on another feature's provider tree.

### 8.7 State contract summary

| Owner                  | Read surface            | Write or refresh surface                       |
| ---------------------- | ----------------------- | ---------------------------------------------- |
| Worker record          | feature query hook      | server mutation followed by query invalidation |
| Durable browser intent | store selector hook     | exported store action                          |
| URL value              | typed route search hook | typed route navigation                         |
| Theme preference       | route context           | cookie-backed theme helper                     |
| Ephemeral interaction  | component hook          | component event handler                        |
| Feature subtree value  | feature context hook    | owning feature provider                        |

This table is a placement constraint, not a required abstraction count. A feature selects the
narrowest surface that matches its value's owner and lifetime. It avoids introducing a store or
context merely to avoid a direct prop where the value has one consumer.

## 9. Open Questions

N/A
