---
title: Recipe Feature - Display (List, Detail, Card, Search, Quantities)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, recipe, ui, display, list, detail, card, search, quantities]
---

# Introduction

This spec covers the read-side of the recipe feature: the home grid, the recipe detail page (with
mobile tabs + swipe and desktop two-column grid), the recipe card, the search bar, the search
list page, the `QuantityControls` component (with its toggle between "add to shopping list" and
the increment/decrement controls), and the integration with the shopping-list and recipe-quantities
Zustand stores.

Source files:

- `src/features/recipe/api/{get-all,get-one}.ts`
- `src/features/recipe/components/{recipe-card,recipe-section,quantity-controls,search-bar}.tsx`
- `src/features/recipe/hooks/{use-is-in-shopping-list,use-recipe-quantities}.ts`
- `src/routes/recipe/$id.tsx`
- `src/routes/index.tsx`
- `src/routes/search.tsx`
- `src/routes/api/{image,video}/$id.ts`, `src/utils/get-file-url.ts`

## 1. Purpose & Scope

### Purpose

Render persisted recipes consistently across the home grid, the search list, and the detail page,
and let the user scale servings and toggle shopping-list membership without ever leaving the
list-or-detail flow. Image and video assets MUST stream from R2 with the documented cache
headers.

### Out of scope

- Creating, updating, or deleting recipes (see [crud.spec.md](./crud.spec.md)).
- Editing instructions (see [editor.spec.md](./editor.spec.md)); only the read-only render is in
  scope here.

## 2. Definitions

| Term                     | Meaning                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ReducedRecipe`          | Lightweight recipe shape returned by `getAllRecipes`: `{ id, image, name, servings, tags }`.                    |
| `Recipe`                 | Full recipe shape returned by `getRecipe` (`api/get-one.ts`), including `ingredientGroups` and `linkedRecipes`. |
| `RecipeIngredientGroup`  | One ingredient group as nested in `Recipe`, with `groupName?`, `id`, and `groupIngredients[]`.                  |
| Detail two-pane          | Desktop layout `grid grid-cols-5`: ingredients (`col-span-2`) + preparation (`col-span-3`).                     |
| Detail tabs+swipe        | Mobile layout: `Tabs[ingredients                                                                                | preparation]`with`useSwipeTabs`driving a horizontal`motion.div` translation. |
| Recipe quantity          | Per-recipe multiplier in the `recipe-quantities.store` Zustand store, defaults to `recipe.servings`.            |
| Shopping-list membership | A `recipeId` present in the `shopping-list` Zustand store.                                                      |

## 3. Requirements, Constraints & Guidelines

### Requirements

- **REQ-001** `getAllRecipes` MUST be a `GET` server fn that selects only
  `{ id, image, name, servings, tags }` ordered by `name asc`, mapping `image` through
  `getImageUrl` and defaulting `tags ?? []`. Exposed as
  `getRecipeListOptions(): queryOptions({ queryFn: getAllRecipes, queryKey: queryKeys.recipeList() })`.
- **REQ-002** `getRecipe(id)` MUST be a `GET` server fn that loads the recipe with its
  `ingredientGroups` (ordered `isDefault desc`, with the `ingredientGroupSelect` shape) and its
  `linkedRecipes` (each `linkedRecipe` selects `{ id, name }` and its default ingredient group).
  Returns 404 via `notFound()` if absent.
- **REQ-003** The home page (`/`) and the detail page (`/recipe/$id`) MUST set
  `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` via the route's
  `headers()`.
- **REQ-004** R2 GET handlers (`/api/image/$id`, `/api/video/$id`) MUST respond with the same
  cache header and resolve content-type from `httpMetadata.contentType` with fallbacks
  `image/webp` and `video/mp4` respectively. Responses are wrapped through
  `cache.getWithCache(request.url)(...)` (`CacheManager`).
- **REQ-005** The video route MUST also implement `HEAD` via `createR2HeadHandler('video/mp4')`,
  returning `Accept-Ranges: bytes` and `Content-Length`.
- **REQ-006** `RecipeCard`:
  - wraps the whole card in `<Link to="/recipe/$id" viewTransition>`;
  - renders `recipe.image` as a covering background `<img>` plus a gradient overlay (`bg-white/30
mask-[linear-gradient(...)] backdrop-blur-sm`) for legibility;
  - lists `recipe.tags` as `Badge`s with `vegetarian` highlighted in `bg-emerald-100
text-emerald-600`;
  - renders `<QuantityControls variant="card" recipeId servings />` inside `<ClientOnly fallback>`.
- **REQ-007** `QuantityControls`:
  - renders an "Ajouter à la liste de courses" button (`variant="outline"`, full width) when
    `variant === 'card' && !isInShoppingList(recipeId)`;
  - otherwise renders `[− <span>{quantity}</span> + <toggle-button>]`;
  - decrement button is disabled when `quantity === 1`;
  - the toggle button label flips between `'Ajouter à la liste'` and `'Supprimer de la liste'`
    based on `useIsInShoppingList(recipeId)`;
  - in `variant === 'card'` ALL click handlers run through `withStopPropagation` to keep the
    `<Link>` inert on button clicks.
- **REQ-008** `useRecipeQuantities(recipeId, defaultValue)` MUST return:
  - `quantity = recipesQuantities[recipeId] ?? defaultValue ?? 0`,
  - `incrementQuantity()` and `decrementQuantity()` that call
    `setRecipesQuantities(recipeId, quantity ± 1)`,
  - or no-ops if `recipeId` is null/undefined.
- **REQ-009** `useIsInShoppingList(recipeId)` MUST return
  `useShoppingListStore(state => state.shoppingList).includes(recipeId)`.
- **REQ-010** `RecipeIngredientGroups` (`recipe-section.tsx`) MUST scale each ingredient quantity
  with `(quantity * currentQuantity) / baseServings` and append the unit name from
  `UNITS[unitSlug]?.name` when `unitSlug` is set. Use `formatNumber(...)` from `@/utils/number`.
- **REQ-011** Detail page (`/recipe/$id`) MUST:
  - on mobile (`md:hidden`), render `Tabs` controlled by `useSwipeTabs(['ingredients',
'preparation'] as const, 'ingredients')` and a `motion.div style={{ x: swipeX }}` with the
    swipe handlers attached;
  - on desktop (`md:grid`), render `grid-cols-5` with ingredients in `col-span-2` and the
    Lexical editor in `col-span-3`, both inside `rounded-xl border` panels;
  - inject the recipe's image as `ScreenLayout backgroundImage={recipe.image}`;
  - merge linked recipes' default ingredient group into the displayed ingredient groups, using
    `linkedRecipe.name` as the group's `groupName` and `isDefault: false`;
  - render the page-level `<QuantityControls />` (default variant);
  - when `authUser` is set, render a `ResponsivePopover` action menu with "Modifier" (`Link to
/recipe/edit/$id`) and `<DeleteRecipe />`.
- **REQ-012** The `/` home page is publicly readable but the floating "new recipe" button only
  renders when `authUser` is set.
- **REQ-013** `/recipe/edit/$id` MUST `redirect({ to: '/auth/login' })` in `beforeLoad` when
  `authUser` is null. Its loader pre-fetches `getRecipeDetailsOptions(id)`,
  `getIngredientListOptions()`, and `getRecipeListOptions()`.
- **REQ-014** `SearchBar` (`components/search-bar.tsx`):
  - opens via Cmd/Ctrl+K (platform-aware label via `usePlatform`);
  - feeds `useQuery(getRecipeListOptions())` into `<Command items={recipes}>`;
  - on item click, navigates to `/recipe/$id` and closes;
  - shows "Aucun résultats trouvé." when the filter is empty.
- **REQ-015** `/search` page filters the same list client-side
  (`recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))`) and displays
  results as an `ItemGroup` of `<Link>` items.

### Constraints

- **CON-001** The detail page's loader MUST use `ensureQueryData(getRecipeDetailsOptions(id))` so
  the SSR pass has the data.
- **CON-002** `<RecipeIngredientGroups />` and `<QuantityControls />` rely on Zustand stores that
  are client-only; they MUST be wrapped in `<ClientOnly />` (with a `Skeleton` fallback for the
  card footer to avoid layout shift).
- **CON-003** In dev (`import.meta.env.DEV`), `getImageUrl(key)` returns
  `https://picsum.photos/seed/${key}/300/200` instead of `/api/image/${key}`. Tests that hit
  image URLs MUST account for this.
- **CON-004** The merge of linked recipes' ingredients into the detail page list relies on
  `linkedRecipe.ingredientGroups[0]` being defined (the loader's `where: { isDefault: true }`).
  If a linked recipe has no default group, the merge produces an entry without
  `groupIngredients`.

### Guidelines

- **GUD-001** Always pass `viewTransition` to internal `<Link>`s on the card and detail menu so
  routing animations stay consistent.
- **GUD-002** Tag pills should use the language-localized `RECIPE_TAG_LABELS` map; never render
  the raw enum value.
- **GUD-003** The card and the page-level controls share the `QuantityControls` component; do NOT
  duplicate its logic.

## 4. Interfaces & Data Contracts

### Query options

```ts
getRecipeListOptions(): queryOptions<ReducedRecipe[]>     // queryKey: queryKeys.recipeList()
getRecipeDetailsOptions(id: number): queryOptions<Recipe>  // queryKey: queryKeys.recipeDetail(id)
getRecipeInstructionsOptions(id: number): queryOptions<{ id, name, instructions } | undefined>
                                                          // staleTime: 5 min, used by SubrecipeNode
```

### Component signatures

```tsx
<RecipeCard recipe={ReducedRecipe} />

<RecipeIngredientGroups
  recipeId={number}
  baseServings={number}
  ingredientGroups={Recipe['ingredientGroups']}
/>

<QuantityControls
  recipeId={number}
  servings={number}
  variant?='default' | 'card'
  className?: string
/>

<SearchBar />  // global, no props
```

### Hooks

```ts
useRecipeQuantities(recipeId?: number, defaultValue?: number):
  { quantity: number, incrementQuantity(): void, decrementQuantity(): void }

useIsInShoppingList(recipeId: number): boolean
```

### Routes

| Route              | Auth              | Cache       | Loader prefetches                               |
| ------------------ | ----------------- | ----------- | ----------------------------------------------- |
| `/`                | public            | 1d / SWR 7d | `getRecipeListOptions()`                        |
| `/recipe/$id`      | public            | 1d / SWR 7d | `getRecipeDetailsOptions(id)`                   |
| `/recipe/new`      | login required    | —           | ingredients list + recipes list                 |
| `/recipe/edit/$id` | login required    | —           | recipe detail + ingredients list + recipes list |
| `/search`          | public            | —           | `getRecipeListOptions()`                        |
| `/api/image/$id`   | public GET        | 1d / SWR 7d | —                                               |
| `/api/video/$id`   | public GET + HEAD | 1d / SWR 7d | —                                               |

## 5. Acceptance Criteria

- **AC-001** Visiting `/` after a fresh load renders one card per recipe, ordered by name
  ascending.
- **AC-002** Each card on the home page renders `recipe.image` (picsum in dev), the recipe name,
  one badge per tag (with `vegetarian` styled green), and the footer control.
- **AC-003** Clicking a card navigates to `/recipe/$id` with a view transition.
- **AC-004** Clicking the card's "Ajouter à la liste de courses" button DOES NOT navigate (event
  is stopped) and adds the `recipeId` to the shopping-list store, immediately swapping the button
  for the `−/+/Supprimer de la liste` row.
- **AC-005** On `/recipe/$id`, `−` is disabled when `quantity === 1`.
- **AC-006** Pressing `+` once doubles the displayed ingredient quantities relative to
  `recipe.servings * 2 / recipe.servings`.
- **AC-007** On mobile, swiping left on the detail page transitions from the Ingredients tab to
  the Preparation tab (and `useSwipeTabs` updates `activeTab`).
- **AC-008** On desktop, the Ingredients and Preparation panes are visible side-by-side without
  tabs.
- **AC-009** When `authUser` is null, the detail page's action popover trigger does NOT render.
- **AC-010** Pressing Cmd/Ctrl+K from anywhere opens the SearchBar dialog. Typing filters the
  list (using the underlying `Command` matching). Clicking an item navigates to that recipe.
- **AC-011** `/api/image/$id` for a known key returns 200 with `Content-Type: image/webp` (or the
  original metadata) and the documented `Cache-Control` header. For an unknown key it throws
  `notFound()` (404).

## 6. Test Automation Strategy

- **PAT-001** Component tests for `RecipeCard` and `QuantityControls` use RTL with mocked Zustand
  stores. Verify the variant flip, the `withStopPropagation` behavior on card click, and the
  decrement-disabled state.
- **PAT-002** `RecipeIngredientGroups` test: feed two groups (one default, one with a
  `groupName`) and verify the scaled quantities for `quantity = baseServings * 2`.
- **PAT-003** Server-fn tests for `getAllRecipes` and `getRecipe(id)` mock `getDb()` and assert
  the returned shape, the not-found path for `getRecipe`, and the `getImageUrl` mapping.
- **PAT-004** Route tests: verify `headers()` returns the cache header on `/` and `/recipe/$id`,
  and that `/recipe/edit/$id`'s `beforeLoad` redirects unauthenticated users.
- **PAT-005** R2 handler tests: stub `env.R2_BUCKET.get/head` and verify cache headers and 404
  behavior. Use the `cache.getWithCache(...)` injection point.

## 7. Rationale & Context

- **Why two layouts on the detail page?** Ingredient density vs. instruction reading is very
  different on phone and desktop. On phone, a single column with swipeable tabs keeps the screen
  uncluttered; on desktop, the side-by-side grid lets the cook keep both visible while working.
- **Why `<ClientOnly>` for the card footer?** `useShoppingListStore` and
  `useRecipeQuantitiesStore` read from `localStorage`. Rendering them during SSR would either
  hydrate-mismatch or force a serialized empty state that flickers.
- **Why merge linked recipes into the displayed ingredient groups?** Cooks expect to see the
  full ingredient list of a composite dish (e.g. "Tagliatelles + sauce bolognaise"). The detail
  loader fetches each linked recipe's _default_ group only; non-default groups are intentionally
  not shown to keep the panel readable.
- **Why a separate `getRecipeInstructionsOptions(id)`?** The `SubrecipeNode` only needs
  `instructions` and the recipe `name`; loading the full recipe would over-fetch. Set
  `staleTime: 5 minutes` because instructions change rarely.
- **Why `viewTransition` on the card link?** The browser View Transitions API gives a smooth
  morph between card and detail-hero on supported browsers.

## 8. Dependencies & External Integrations

- **TanStack Router** (`createFileRoute`, `Link`, `redirect`, `notFound`).
- **TanStack React Query** (`useSuspenseQuery`, `useQuery`, `queryOptions`).
- **Motion** (`motion.div` for the swipe animation).
- **Zustand stores** (`shopping-list.store`, `recipe-quantities.store`).
- **Cloudflare R2** (`env.R2_BUCKET.get/head`) + the shared `CacheManager`
  (`src/lib/cache-manager.ts`).
- **Lexical** (read-only `<Editor readOnly>` from `@/components/ui/editor`) — the editor's full
  contract is owned by [editor.spec.md](./editor.spec.md).
- **`@/components/layout/screen-layout`** for `ScreenLayout` (handles header, background image,
  `headerEndItem`, `withGoBack`).

## 9. Examples & Edge Cases

- **EC-001** Recipe with no tags: card renders no badges; the home grid still aligns thanks to
  `flex-wrap` in `CardDescription`.
- **EC-002** Recipe with a tag string the labels map doesn't know about (forward-compat):
  `RECIPE_TAG_LABELS[tag]` is `undefined`; the badge renders an empty label. Treat as
  data-cleanup TODO.
- **EC-003** Recipe quantity set to 0 manually: the decrement button is enabled (only blocked at
  1). 0 produces 0-quantity ingredients, which formats as `0` and is technically valid.
- **EC-004** A linked recipe with no default ingredient group: the spread
  `...linkedRecipe.ingredientGroups[0]` yields `undefined` keys; the page would render a header
  with `groupName: linkedRecipe.name` and no list. Not a crash but visually empty.
- **EC-005** `/api/image/$id` requested in dev pointing at a real R2 key: the dev server still
  goes through the handler, but `getImageUrl` re-routes the client to picsum, so the handler is
  rarely hit. Verify both paths in integration tests.
- **EC-006** Search with a query that has no matches: `/search` shows an empty `ItemGroup`;
  consider a "no results" message in a future iteration.

## 10. Validation Criteria

- The shapes of `ReducedRecipe` and `Recipe` MUST match the actual return types of
  `getAllRecipes` / `getRecipe` (Drizzle relational types).
- The cache headers in §3 REQ-003 / REQ-004 MUST match the `headers()` and the R2 handler.
- The auth gate behavior on `/recipe/edit/$id` and the floating button on `/` MUST match the
  source.
- The mobile/desktop layout breakpoint is `md:` everywhere.

## 11. Related Specifications / Further Reading

- [./index.spec.md](./index.spec.md)
- [./crud.spec.md](./crud.spec.md) — write-side that produces the data this spec consumes.
- [./editor.spec.md](./editor.spec.md) — defines how `recipe.instructions` is rendered (read-only)
  and edited.
- [../../../../docs/architecture.spec.md](../../../../docs/architecture.spec.md)
- [../../../../docs/infrastructure/data-layer.spec.md](../../../../docs/infrastructure/data-layer.spec.md)
- [../../../../docs/infrastructure/server-functions.spec.md](../../../../docs/infrastructure/server-functions.spec.md)
- [../../../../docs/infrastructure/forms.spec.md](../../../../docs/infrastructure/forms.spec.md)
- [../../../../docs/infrastructure/routing-ssr.spec.md](../../../../docs/infrastructure/routing-ssr.spec.md)
- [../../shopping-list/shopping-list.spec.md](../../shopping-list/shopping-list.spec.md) — uses
  the `recipeId`s placed in the shopping-list store by `QuantityControls`.
- [../../ingredients/ingredients.spec.md](../../ingredients/ingredients.spec.md)
