---
title: Recipe Display
status: amended
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: src/features/recipe/spec/index.spec.md
related:
  [docs/infrastructure/client/client-state.spec.md, docs/infrastructure/client/routing-ssr.spec.md, src/features/shopping-list/shopping-list.spec.md]
---

## Why

A persisted recipe must be discoverable, readable, and adjustable while cooking. This leaf owns the
queries and cooking surfaces that turn the aggregate into cards, search results, and a cooking view,
serving `index.spec.md` [G-2] and [G-4].

- `[NG-1]` Persisting a user's quantity choice to the recipe aggregate.
- `[NG-2]` Duplicating shopping-list aggregation inside recipe components.
- `[NG-3]` Editing recipe steps from a display surface.

## Design

- `[PI-1]` **One recipe, many surfaces** — cards, search, and detail derive from shared recipe query
  contracts.
- `[PI-2]` **Controls do not hijack navigation** — card quantity actions remain siblings of the
  recipe link.
- `[PI-3]` **Amounts explain themselves** — ingredient quantities scale relative to base servings and
  retain their unit labels.

| Decision                         | Choice                                                                                                                                                                            | Rationale                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `[KD-1]` Query projections       | Cards receive reduced recipes; detail receives the ingredient graph, links, and ordered step groups; the instructions projection returns a recipe's name and default-group steps. | Browsing stays compact while the cooking view and sub-recipe sections get their full context. |
| `[KD-2]` Responsive cooking view | Phones use swipeable ingredient and preparation tabs; desktop shows adjacent panes.                                                                                               | Each device gives the cook a legible view of the content it can fit.                          |
| `[KD-3]` Quantity state          | A recipe-id keyed client store holds the selected quantity and scales ingredients from servings.                                                                                  | A cook can adjust portions immediately without mutating the shared recipe.                    |
| `[KD-4]` Asset delivery          | Image and video route handlers stream R2 objects through the shared cache boundary.                                                                                               | Media remains private to application routing while retaining cacheable delivery.              |

The instruction renderer receives step groups and delegates to `RecipeStepGroups` (`editor.spec.md`
[CT-4]); it does not interpret Magimix data, bold markdown, or sub-recipe groups itself. The detail control submits the recipe DELETE mutation while CRUD retains authorization and graph removal.

## Outcome

- `[SO-1]` The home grid and search share one name-ordered list projection whose cards navigate to
  the recipe without quantity actions triggering navigation. — demonstrated by `[VC-1]`
- `[SO-2]` The cooking view shows own and linked ingredient groups, scaled quantities, and ordered
  preparation steps, as tabs on phones and side-by-side on desktop. — demonstrated by `[VC-2]`, `[VC-3]`
- `[SO-3]` Media is served through application routes with fixed cache lifetimes. — demonstrated by
  `[VC-4]`

## Contracts

### `[CT-1]` Query projections

| Projection            | Fields                                                         | Surface               | Server helper                       |
| --------------------- | -------------------------------------------------------------- | --------------------- | ----------------------------------- |
| Reduced recipe        | ID, name, image URL, servings, flags, meals/cuisines           | Home, search, palette | `listRecipes(db)`                   |
| Detail recipe         | Reduced fields plus ingredient graph, links, stepGroups, video | Cooking view          | `getRecipeDetails(db, id)`          |
| Embedded instructions | ID, name, default-group steps                                  | Sub-recipe section    | `getSubrecipeInstructions(db, ids)` |

`src/features/recipe/server/queries.ts` owns these projections. Home/search and the palette share
`recipeList` query options for `GET /api/recipes`. `GET /api/recipes/<id>` reads the recipe, extracts
sub-recipe IDs and resolves names/default steps before returning `{ recipe, subrecipes }`.
No browser instructions request remains.

- Steps use `RecipeStepGroup`/`RecipeStep` (`editor.spec.md` [CT-1]) mapped from rows.
- The list is name-ordered, maps image keys to display URLs, and normalizes absent flag arrays.
- Detail orders default ingredient groups first and includes linked recipes' default groups.
- Missing detail recipes return HTTP 404 for in-page NotFound; API params are validated independently. Missing instruction
  sources are omitted and the renderer hides missing or empty sub-recipe sections.

### `[CT-2]` Navigation and cards

```text
home/search recipeList query ──► cards ──► /recipe/<id> code + query preload
                                                   │
                              detail + subrecipe query ──► client cooking view
```

Home composes `RecipeListContent` with `renderCardAction` for quantity/membership.
Detail composes `RecipeDetailsContent` with `quantityControls` and `renderIngredientGroups`.
Pages import components directly; slots remain plain composition. Metadata and preparation
render on the client after the router awaits code and query data.

Plain card anchors use client navigation. Home links use `preloadLink('viewport')`;
search links use `preloadLink('intent')` for pointerenter, touchstart and focus. Route preloads ensure
query data with 5-minute staleTime and 24-hour gcTime; stale cached data commits immediately with
background refresh. Recipe mutations invalidate `allRecipes`.
Controls remain outside links. Header SearchBar opens with ⌘K/Ctrl+K, reads the shared recipe-list
query, filters locally and uses `router.navigate`. Full search uses the same cache and local filters/recents.

### `[CT-3]` Cooking view and quantities

- Ingredients: own groups plus each linked recipe's default group, labelled with its name.
- Preparation: `RecipeStepGroups(detail.stepGroups)`.
- Amount for base quantity `q`, selected quantity `s`, servings `b`: `q × s / b`. Quantity defaults
  to `b`; decrement stops at 1.
- Controls: without shopping-list membership a card shows an add action; a selected card and the
  detail page show decrement, quantity, increment, and membership toggle. A missing recipe id yields
  no mutation.
- Edit and delete actions show only for an authenticated viewer; CRUD enforces owner-or-admin.
- Home, details and search are SPA screens sharing the list/detail query projections. Browse APIs
  do not gate membership; edit/create affordances derive from `['session']`. The edit route's member
  guard chooses the screen, then preloads recipe detail, ingredients and recipe list; the API authorizes writes.
- The page passes GoBackButton through the `backButton` slot. Mobile tabs remain native hash anchors;
  mounted DS Tabs scroll and replace the hash without extra history entries.
- Management controls await feature DELETE mutation options. The API retains owner-or-admin policy;
  success invalidates `allRecipes` and calls `router.navigate('/', { replace: true })` so Back cannot
  reopen the deleted recipe. Failures alert via `alertError`.

### `[CT-4]` Media handlers

| Handler    | Behavior                                                        | `Cache-Control`                                        |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| Image GET  | Stream R2 object, stored content type or image fallback         | `public, max-age=31536000, immutable`                  |
| Video GET  | Stream R2 object, stored content type or video fallback         | `public, max-age=86400, stale-while-revalidate=604800` |
| Video HEAD | Byte-range metadata so the browser can seek without downloading | same as video GET                                      |

Handlers validate the opaque key and return not-found for absent objects. Image URLs resolve through
the file-url helper.

## Acceptance

- `[VC-1]` Given the home grid, when the cook clicks a card's quantity action, then membership
  changes without navigation; clicking the card link opens `/recipe/<id>`; search filters the same
  list. — demonstrates `[SO-1]`
- `[VC-2]` Given a recipe with servings 4 and an ingredient of 200 g, when the quantity is set to 6,
  then 300 g renders, and decrementing stops at 1. — demonstrates `[SO-2]`
- `[VC-3]` Given a recipe with a step linking a Magimix program, a sub-recipe group, and a named group, when
  its detail page opens on phone and desktop widths, then all render in order in the preparation tab or pane. —
  demonstrates `[SO-2]`
- `[VC-4]` Given stored image and video keys, when requested, then responses carry the listed
  `Cache-Control` values and video HEAD reports byte-range metadata; an unknown key is 404. —
  demonstrates `[SO-3]`

## Caveats

- `[C-1]` Development image URLs use placeholders, so browser tests can observe a different image
  host from deployed recipe media.
- `[C-2]` A linked recipe without a default ingredient group contributes no usable ingredient list to
  the composite cooking view.
- `[C-3]` The preparation renderer depends on `RecipeStepGroups` owned by the editor leaf.

## Open Questions

N/A

## Changelog

| Date       | Amendment                                                                           | Sections affected | Reason                          |
| ---------- | ----------------------------------------------------------------------------------- | ----------------- | ------------------------------- |
| 2026-10-03 | Document direct control composition, card prefetch, and replacing delete redirects. | Design, CT-2–CT-3 | Match hydrated recipe browsing. |
