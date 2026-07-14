# §07 — State, Query & Auth

Three framework-coupled runtime layers, all with direct Solid adapters. Port these right after §02
(before the UI work) so feature components have working data when they're migrated.

## TanStack Query → solid-query

- Provider: `QueryClientProvider` from `@tanstack/solid-query` (wired via
  `setupRouterSsrQueryIntegration`, already handled in §02's router).
- **Accessor options**: solid-query takes option _factories_ — `useQuery(() => getRecipeOptions(id))`
  not `useQuery(getRecipeOptions(id))`. Wrap every call site in an arrow so params stay reactive.
- Results are accessors: `query.data` → `query.data` is still a property but the object is a store;
  read fields reactively in JSX. `isLoading`/`isPending` unchanged names.
- `queryOptions` / `mutationOptions` factories in `features/*/api/*.ts` import from
  `@tanstack/solid-query`. The option **objects** (`queryKey`, `queryFn`, `onSuccess`) are
  identical; only the import changes.
- `ensureQueryData` in route loaders (architecture cross-feature flow step 3) — same API on the
  Solid `queryClient`. The isomorphic `getAuthUser` SSR-bypass logic (memory 7666/7675) must be
  preserved verbatim; it's framework-neutral.
- Devtools: `@tanstack/solid-query-devtools` (optional, §02).

`src/lib/query-keys.ts` is pure data — **no change**.

## TanStack Store → solid-store

`@tanstack/solid-store` mirrors the React variant. The persisted-store helper does the heavy lifting.

- `src/lib/persisted-store.ts` — the `persistedStore` factory (localStorage-backed `Store`). `Store`
  from `@tanstack/store` (framework-agnostic core) is unchanged; only the React-specific `useStore`
  binding used by consumers changes.
- Consumers use `useStore(store, selector)` from `@tanstack/solid-store`, which returns an
  **accessor**: `const ids = useStore(shoppingListStore, s => s.ids)` → read `ids()`.
- Stores themselves (`stores/recent-recipes.store.ts`, `recipe-quantities.store.ts`,
  `shopping-list.store.ts`) hold plain `Store` instances + action functions
  (`addToShoppingList(id)` → `store.setState`). **Action functions and store definitions don't
  change** — only the component-side `useStore` hook.
- Existing store tests (`*.store.test.ts`) test the store/actions, not React — they should pass
  unchanged (verify in §09).
- CON-004 invariant holds: stores are client-only, components consuming them never SSR. No change.

## Better Auth → better-auth/solid

- **Client only**: `src/lib/auth/auth-client.ts`

  ```ts
  import { createAuthClient } from 'better-auth/solid' // was better-auth/react
  export const authClient = createAuthClient({ baseURL: import.meta.env.VITE_PUBLIC_URL })
  ```

  The solid client exposes signals/stores for session state instead of hooks — `authClient.useSession()`
  returns an accessor. Update the (few) consumers.

- **Server unchanged**: `auth-server.ts`, `auth-guard.ts`, `get-auth-user.ts` are Worker-side; they
  use `better-auth` core + `@tanstack/start-server-core` request helpers — no framework coupling.
  Keep the DEV admin bypass (`import.meta.env.DEV`) and the isomorphic SSR handling intact.
- The `/api/auth/$.ts` catch-all route handler is server-side — import rename only (§02).

## Order within this step

1. `query-keys.ts` (no-op) → confirm import graph.
2. solid-store consumers (stores power the leaf UI like `QuantityControls`).
3. solid-query api factories + loaders.
4. `auth-client.ts` + its consumers.

## Validation

- A store round-trip: add a recipe to the shopping list, reload, it persists (localStorage).
- A query round-trip: recipe detail loads via loader-prefetched `ensureQueryData`, no waterfall.
- Auth: login flow reaches Google OAuth, session accessor reflects logged-in state, `authGuard`
  still blocks `/recipe/new` when logged out (AC-002).
- Mutation invalidation still fires (AC-004: `queryKeys.recipeLists()` invalidated + toast).

## ponytail notes

- Query keys, store definitions, action functions, and the entire auth server are framework-neutral
  — resist the urge to "clean them up" during the port. Import renames + accessor call sites only.
