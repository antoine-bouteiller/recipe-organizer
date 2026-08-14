---
title: Recipe Display
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: src/features/recipe/spec/index.spec.md
related:
  [docs/infrastructure/client/client-state.spec.md, docs/infrastructure/client/routing-ssr.spec.md, src/features/shopping-list/shopping-list.spec.md]
---

## 2. Problem Statement

N/A — goals remain owned by `src/features/recipe/spec/index.spec.md` [G-2] and [G-4]. This leaf
owns the queries and cooking surfaces that turn a persisted recipe into a discoverable, readable,
and adjustable experience.

## 3. Key Design Decisions

| Decision                         | Choice                                                                                           | Rationale                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `[KD-1]` Query projections       | Cards receive reduced recipes; detail receives the ingredient graph, links, and instructions.    | Browsing stays compact while the cooking view has its full context.              |
| `[KD-2]` Responsive cooking view | Phones use swipeable ingredient and preparation tabs; desktop shows adjacent panes.              | Each device gives the cook a legible view of the content it can fit.             |
| `[KD-3]` Quantity state          | A recipe-id keyed client store holds the selected quantity and scales ingredients from servings. | A cook can adjust portions immediately without mutating the shared recipe.       |
| `[KD-4]` Asset delivery          | Image and video route handlers stream R2 objects through the shared cache boundary.              | Media remains private to application routing while retaining cacheable delivery. |

## 4. Principles & Intents

- `[PI-1]` **One recipe, many surfaces** — cards, search, and detail derive from shared recipe
  query contracts.
- `[PI-2]` **Controls do not hijack navigation** — card quantity actions remain siblings of the
  recipe link.
- `[PI-3]` **Amounts explain themselves** — ingredient quantities scale relative to base servings
  and retain their unit labels.

## 5. Non-Goals

- `[NG-1]` Persisting a user's quantity choice to the recipe aggregate.
- `[NG-2]` Duplicating shopping-list aggregation inside recipe components.
- `[NG-3]` Editing recipe instructions from a display surface.

## 6. Caveats

- `[C-1]` Development image URLs use placeholders, so browser tests can observe a different image
  host from deployed recipe media.
- `[C-2]` A linked recipe without a default ingredient group contributes no usable ingredient list
  to the composite cooking view.
- `[C-3]` The detail route's instruction renderer depends on the node registration owned by the
  editor leaf.

## 7. High-Level Components

| Component           | Module type                       | Responsibility                              | Public API surface                           |
| ------------------- | --------------------------------- | ------------------------------------------- | -------------------------------------------- |
| Recipe list query   | Server function and query options | Provide name-ordered card data              | `getRecipeListOptions`, `ReducedRecipe`      |
| Recipe detail query | Server function and query options | Provide cooking document data               | `getRecipeDetailsOptions`, `Recipe`          |
| Cards and search    | Components and routes             | Browse and navigate recipes                 | `RecipeCard`, `SearchBar`                    |
| Cooking view        | Route and components              | Show ingredients, instructions, and actions | ingredient groups, controls                  |
| Quantity hooks      | Client hooks                      | Scale servings and toggle list membership   | `useRecipeQuantities`, `useIsInShoppingList` |
| Media handlers      | Route handlers                    | Stream image/video objects                  | image GET, video GET/HEAD                    |

## 8. Detailed Design

### 8.1 Query and navigation model

`getRecipeListOptions` exposes reduced recipes ordered by name for the home grid and client-side
search. `getRecipeDetailsOptions(id)` exposes a recipe with ordered ingredient groups and linked
recipes. A missing detail recipe is a not-found response. Search opens from the platform shortcut,
filters the shared list, and navigates to the selected recipe.

```text
list query ──► RecipeCard ──► /recipe/$id ──► detail query
     │              │                                  │
     └──────────────┴──────────── search ──────────────┘
```

Cards display a localised set of recipe flags and a link that uses a view transition. Their quantity
controls sit outside the link, preventing an action click from becoming navigation. The home route
and search route share the list projection, so a card means the same recipe whether it appears in a
grid, a command palette, or a filtered results list.

| Projection     | Fields                                                 | Surface                      |
| -------------- | ------------------------------------------------------ | ---------------------------- |
| Reduced recipe | id, name, image URL, servings, derived flags           | Card grid and search         |
| Detail recipe  | reduced fields plus groups, links, instructions, video | Cooking view                 |
| Instructions   | id, name, serialized instructions                      | Embedded sub-recipe renderer |

The list projection maps image keys to display URLs and represents absent flag collections as empty.
The detail projection orders default ingredient groups first and includes each linked recipe's default
group, allowing the cooking view to build its composite ingredient presentation from one response.

### 8.2 Cooking view and quantities

The detail page combines own ingredient groups with the default group from each linked recipe,
labelled with that recipe's name. It renders instructions using `recipeNodes` from the editor leaf.
Phone layouts switch between ingredients and preparation with tabs and swipe movement; desktop
layouts show both in a two-column arrangement.

For an ingredient with base quantity `q`, selected quantity `s`, and recipe servings `b`, the
rendered amount is `q × s / b`. Quantity state defaults to `b`, decrements stop at one, and a
card action adds or removes the recipe id from shopping-list state. Recipe edit and deletion actions
appear only for an authenticated viewer.

Quantity controls have two presentation modes. A card with no shopping-list membership presents an
add action; a selected card and the detail page present decrement, displayed quantity, increment, and
membership toggle controls. The controls tolerate a missing recipe id by producing no mutation,
which keeps their API usable in composed layouts.

### 8.3 Route access and rendering

Recipe list, search, and detail routes render their content client-side inside the authenticated
application shell. The edit route redirects an unauthenticated viewer to sign-in and prefetches the
recipe, ingredients, and recipe list data required by its form. Detail actions expose edit and delete
only when an authenticated viewer is available; CRUD enforces the separate owner-or-admin decision.

Recipe routes do not grant public document caching because their shell is user-dependent. Media
handlers own their cache behavior independently, allowing image and video delivery to use the shared
cache manager without turning a recipe page into a publicly cached document.

### 8.4 Interaction boundaries

The cooking view reads shopping-list membership through the dedicated hook and delegates membership
changes to that store. It does not calculate an aggregated shopping list. Its quantity hook owns only
the selected multiplier; it does not alter recipe servings or write to the recipe aggregate. These
small boundaries allow the card footer and detail controls to share behavior despite their different
layouts.

The instruction renderer receives serialized content and the feature's node registry. It does not
interpret Magimix payloads or sub-recipe filtering itself; those semantics belong to the editor leaf.
Likewise, display uses mutation options for deletion while CRUD retains authorization and graph
removal decisions. Each UI surface therefore remains a consumer of explicit recipe contracts.

### 8.5 Media contract

Recipe image URLs resolve through the file-url helper. Image GET and video GET handlers return R2
objects through the cache manager with their stored content type or a media fallback. Video HEAD
reports byte-range metadata so a browser can inspect and seek the object without retrieving it.

The handlers validate the requested opaque key, return not-found for absent objects, and use media
content metadata with image and video fallbacks. Their cache policy permits a day of freshness and a
week of stale-while-revalidate delivery. This contract applies to media objects only; recipe query
responses remain part of the client application's server-data lifecycle.

## 9. Open Questions

N/A
