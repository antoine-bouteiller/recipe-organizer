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
[CT-4]); it does not interpret Magimix data, bold markdown, or sub-recipe groups itself. The detail island posts its page action for deletion while CRUD retains authorization and graph removal.

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

`src/features/recipe/server/queries.ts` owns these projections. Home/search loaders read the list
directly; the palette alone retains `GET /api/recipes`. Detail loader reads the recipe, extracts
sub-recipe IDs from its step groups, and resolves names/default steps before returning props.
No browser instructions request remains.

- Steps use `RecipeStepGroup`/`RecipeStep` (`editor.spec.md` [CT-1]) mapped from rows.
- The list is name-ordered, maps image keys to display URLs, and normalizes absent flag arrays.
- Detail orders default ingredient groups first and includes linked recipes' default groups.
- Missing/invalid detail IDs return `recipe: null` for in-page NotFound. Missing instruction
  sources are omitted and the renderer hides missing or empty sub-recipe sections.

### `[CT-2]` Navigation and cards

```text
home/search loader ──► list props ──► cards ──► /recipe/<id> loader
                                                   │
                              detail + subrecipe props ──► cooking HTML + islands
```

Home composes `RecipeListContent` with `renderCardAction` islands for quantity/membership.
Detail composes `RecipeDetailsContent` with a quantityControls slot and renderIngredientGroups
islands. Static metadata and preparation remain server-rendered. Relative nearby `_name.tsx`
default re-exports carry the island import attributes; feature components do not wire framework
islands themselves.

Void card links perform document navigation to island details; cross-document transitions enhance
supported browsers. Controls remain outside links. Header SearchBar opens with ⌘K/Ctrl+K, loads
the list on first open, filters locally, and navigates with `location.assign`.
Full search is its own load island with loader-fed recipes and local filters/recents.

### `[CT-3]` Cooking view and quantities

- Ingredients: own groups plus each linked recipe's default group, labelled with its name.
- Preparation: `RecipeStepGroups(detail.stepGroups)`.
- Amount for base quantity `q`, selected quantity `s`, servings `b`: `q × s / b`. Quantity defaults
  to `b`; decrement stops at 1.
- Controls: without shopping-list membership a card shows an add action; a selected card and the
  detail page show decrement, quantity, increment, and membership toggle. A missing recipe id yields
  no mutation.
- Edit and delete actions show only for an authenticated viewer; CRUD enforces owner-or-admin.
- Home and details render as server island pages in the browse layout; search receives the same list projection in its load island. Browse loaders do not gate membership; edit/create affordances derive from shared identity. The regular edit loader gates membership and reads recipe, ingredients, and recipe list directly.
- The page passes GoBackButton as a load island. Mobile tabs remain native hash anchors in static
  HTML; hydrated DS Tabs scroll and replace the hash without extra history entries.
- The idle management-actions island posts native `fetch('/recipe/<id>', { method: 'POST' })`
  for deletion, alerts non-OK responses, and navigates home on success. The guarded server action
  retains owner-or-admin deletion policy.

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
