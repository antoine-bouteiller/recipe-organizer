---
title: Client state layering
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./server-functions.spec.md
  - ./forms.spec.md
  - ../../src/features/shopping-list/shopping-list.spec.md
---

## 2. Problem Statement

State lives in several layers in this app, each with different lifetime, scope, and persistence. We need
consistent rules so features reach for the right tool:

- `[G-1]` Server cache (recipes, ingredients, users, etc.): TanStack Query with centralized keys, route loaders
  pre-fetching, and `useQuery` / `useSuspenseQuery` on the render side.
- `[G-2]` Client-only persistent state (cart, per-recipe desired servings): Zustand with the `persist`
  middleware writing to localStorage.
- `[G-3]` Form state: TanStack Form (see forms spec).
- `[G-4]` URL state: route search params (`?tab=pending`, error codes on `/auth/login`).
- `[G-5]` Ephemeral UI state (open dialogs, hover, active tab): plain `useState` inside components.
- `[G-6]` Components that read Zustand stores during SSR must be wrapped in `<ClientOnly>` to avoid hydration
  mismatches.

## 3. Key Design Decisions

| Decision                                        | Choice                                                                              | Rationale                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `[KD-1]` TanStack Query for server state        | Single `queryClient` bootstrapped at the root route context                         | SSR + CSR caching, automatic revalidation, dev tools built in.                             |
| `[KD-2]` Zustand for client-only state          | `create(persist(...))`, with `partialize` to control what's written to localStorage | Minimal runtime; `persist` covers localStorage seamlessly; no context provider.            |
| `[KD-3]` `ClientOnly` boundary                  | Wrap any component that reads Zustand `.persist()` stores                           | localStorage isn't available during SSR; rendering the store value diverges from SSR HTML. |
| `[KD-4]` Route loaders pre-fetch                | `loader: ({ context }) => context.queryClient.ensureQueryData(...)`                 | SSR has real data on first paint; client hydrates the cache.                               |
| `[KD-5]` `useSuspenseQuery` for guaranteed data | Used when the route loader has pre-fetched (e.g., `useShoppingList`)                | No "data loading" branch in render; relies on Suspense boundary.                           |
| `[KD-6]` Centralized query keys                 | `src/lib/query-keys.ts`                                                             | See data-layer spec `[KD-7]`.                                                              |
| `[KD-7]` URL state for filters / tabs           | Route search params, Zod-validated on load                                          | Browser back/forward work; shareable URLs.                                                 |
| `[KD-8]` No global context for UI               | Toasts via `toastManager` module (not context); theme via root context only         | Fewer providers; `toastManager` is a singleton subscribe-able store.                       |

## 4. Principles & Intents

- `[PI-1]` **Server data → TanStack Query** — never stage server responses in Zustand.
- `[PI-2]` **Cross-component client state → Zustand** — when 2+ unrelated components need to read / write the
  same client-only state (cart, servings), use a store. Single-component state stays `useState`.
- `[PI-3]` **Persist selectively** — `partialize` each persisted store to only the keys that make sense across
  reloads. Don't persist setters or derived state.
- `[PI-4]` **`<ClientOnly>` where it matters** — any tree that reads a persisted store during first paint is
  client-only. The fallback should approximate the dimension/skeleton of the eventual content.
- `[PI-5]` **Query key hygiene** — see server-functions spec `[PI-4]`. Invalidate the tightest correct key.
- `[PI-6]` **URL is source of truth for navigation state** — active tab, active filter, active search.

## 5. Non-Goals

- `[NG-1]` Redux / MobX / Jotai.
- `[NG-2]` Server-synced client stores (e.g., cart shared across devices).
- `[NG-3]` Optimistic UI for mutations.
- `[NG-4]` Global loading state.
- `[NG-5]` Context providers for simple cross-component sharing (Zustand replaces them).

## 6. Caveats

- `[C-1]` Zustand persist middleware hydrates asynchronously on the client. Between SSR and hydration, a
  persisted store returns its `initialState`. Wrap reads in `<ClientOnly>` to avoid flashing.
- `[C-2]` `useSuspenseQuery` throws if the query is not pre-fetched. Components that use it must live under a
  route whose `loader` calls `ensureQueryData(...)` for the matching key, or under an explicit Suspense
  boundary.
- `[C-3]` TanStack Query's cache is in-memory only; page reload re-fetches. The service worker cache is a
  separate layer (see platform spec).
- `[C-4]` `toastManager` is a module singleton, not a React context — do not expect React tree scoping.
- `[C-5]` Route search params must be Zod-validated on load; otherwise, a malformed URL can blow up the loader.

## 7. High-Level Components

| Component             | Module type         | Responsibility                                              | Public API surface                                                  |
| --------------------- | ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| TanStack Query client | Provider            | Cache for server data; dev tools                            | Bootstrapped in `src/routes/router.tsx`; injected into root context |
| Query-key factories   | Constants           | Hierarchical cache keys                                     | `src/lib/query-keys.ts`                                             |
| Zustand stores        | Stores              | `useShoppingListStore`, `useRecipeQuantitiesStore`          | `src/stores/*.ts`                                                   |
| `<ClientOnly>`        | TanStack Start comp | Render-guard for client-only state readers                  | `@tanstack/react-router` → `ClientOnly`                             |
| Route loaders         | Convention          | Pre-fetch via `context.queryClient.ensureQueryData(...)`    | Per-route `loader` functions                                        |
| Toast manager         | Singleton store     | `toastManager.add(...)`; subscribed to by `<ToastProvider>` | `src/components/ui/toast`                                           |
| Theme                 | Context             | Dark/light mode, injected at root route                     | `src/lib/theme.ts` → `getTheme`; root context                       |

## 8. Detailed Design

| Concern                     | Entry point                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------- |
| Router + query client setup | `src/routes/router.tsx`                                                                |
| Root context                | `src/routes/__root.tsx` → `createRootRouteWithContext<{authUser, queryClient, theme}>` |
| Query keys                  | `src/lib/query-keys.ts`                                                                |
| Cart store                  | `src/stores/shopping-list.store.ts`                                                    |
| Quantities store            | `src/stores/recipe-quantities.store.ts`                                                |
| Theme                       | `src/lib/theme.ts`                                                                     |
| Toast manager               | `src/components/ui/toast/*`                                                            |
| ClientOnly examples         | `src/routes/shopping-list.tsx`, `src/features/recipe/components/quantity-controls.tsx` |

Canonical Zustand persist store:

```typescript
export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      shoppingList: [],
      addToShoppingList: (id) => set(({ shoppingList }) => ({ shoppingList: [...shoppingList, id] })),
      removeFromShoppingList: (id) => set(({ shoppingList }) => ({ shoppingList: shoppingList.filter((n) => n !== id) })),
      resetShoppingList: () => set({ shoppingList: [] }),
    }),
    { name: 'shopping-list', partialize: (state) => ({ shoppingList: state.shoppingList }) }
  )
)
```

Canonical route loader pattern:

```typescript
loader: async ({ context, params }) => {
  await context.queryClient.ensureQueryData(getRecipeDetailsOptions(params.id))
  return { id: params.id }
}
```

## 9. Verification Criteria

- `[VC-1]` No feature stages server responses in Zustand; server data flows through TanStack Query.
- `[VC-2]` Every Zustand store using `persist` has a `partialize` that excludes setters.
- `[VC-3]` Every component that reads a persisted Zustand store in a route that SSRs is wrapped in
  `<ClientOnly>`, OR the route is already client-only.
- `[VC-4]` Every route using `useSuspenseQuery` has a `loader` that `ensureQueryData`s the matching key.
- `[VC-5]` No inline query key arrays; use `queryKeys.*`.
- `[VC-6]` Route search params are Zod-validated on load.
- `[VC-7]` `pnpm typecheck` passes.

## 10. Open Questions

- `[OQ-1]` Should we provide a `<SuspenseBoundary>` helper with a standard skeleton to reduce boilerplate?
- `[OQ-2]` Worth extracting a `createPersistedStore<T>(name, initial, actions)` helper for the Zustand pattern?
