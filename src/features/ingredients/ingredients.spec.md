---
title: Ingredients
status: amended
author: Antoine Bouteiller
date: 2026-10-02
related: [docs/architecture.spec.md]
---

## 2. Problem Statement

Recipes and shopping lists need a shared catalogue that identifies an ingredient, classifies it for
presentation, and records the measurement metadata needed to combine quantities. Cooks maintain that
catalogue from settings while recipe forms consume its options, so the feature preserves one
consistent ingredient vocabulary across the product.

- `[G-1]` Provide a validated ingredient catalogue that recipe forms and shopping-list aggregation can share.
- `[G-2]` Let members maintain ingredient metadata while reserving destructive operations for administrators.
- `[G-3]` Preserve enough measurement information to express a preferred shopping-list unit and convert
  compatible quantities.

## 3. Key Design Decisions

| Decision                       | Choice                                                                                                                     | Rationale                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Ingredient identity   | An ingredient is a relational row with a name, category, optional parent, conversion metadata, and preferred unit.         | One row supplies both the human-facing catalogue and the metadata required wherever the ingredient appears. |
| `[KD-2]` Write authority       | Authenticated members create and edit; only administrators delete.                                                         | Collaborative maintenance stays lightweight while deletion receives stronger protection.                    |
| `[KD-3]` Read coherence        | Page loaders supply the catalogue; actions reload props and API creation refreshes the owning page.                        | Settings and recipe-form consumers observe the refreshed list following a write.                            |
| `[KD-4]` Unit conversion       | Conversion first reaches a canonical unit, then bridges dimensions through grams only when ingredient metadata permits it. | Explicit density and count weight prevent fabricated equivalences between volume, mass, and count.          |
| `[KD-5]` Presentation metadata | Category labels and icons are central mappings; the form and settings list consume them.                                   | French presentation remains consistent while stored category values remain stable identifiers.              |

## 4. Principles & Intents

- `[PI-1]` **Catalogue, not recipe state** — ingredient records describe reusable foodstuffs; recipe quantities
  remain owned by the recipe domain.
- `[PI-2]` **Validate at the Worker boundary** — refine architecture [PI-3]; server functions parse all
  mutations at the D1 boundary.
- `[PI-3]` **Persist conversion facts** — density and one-item weight are optional measured properties, not
  estimates inferred by the application.
- `[PI-4]` **French interface, stable identifiers** — labels and feedback are French while category and unit
  slugs are machine-readable values.

## 5. Non-Goals

- `[NG-1]` Recipe ingredient lines, recipe quantities, and recipe ownership; the recipe feature owns them.
- `[NG-2]` Parent-reference integrity, cascading deletion, or automatic orphan repair.
- `[NG-3]` A user-defined category or unit taxonomy.
- `[NG-4]` Conversion involving length and another measurement dimension.

## 6. Caveats

- `[C-1]` `parentId` is nullable metadata rather than a database-enforced relationship, so a deleted parent
  can leave a child reference (`src/db/schema/ingredient.ts`).
- `[C-2]` A conversion returns no value when a unit chain is malformed, input is non-finite, or density/count
  weight needed to bridge dimensions is absent or non-positive (`src/utils/unit-converter.ts`).
- `[C-3]` The category index supports category-oriented access but the settings search filters the fetched
  list in the browser (`src/db/schema/ingredient.ts`; `src/features/ingredients/client/components/ingredients-management.svelte`).

## 7. High-Level Components

```text
Settings page ──loader──▶ listIngredients ──▶ D1 ingredient rows
      │                         ▲
      ├── Edit / Delete actions ─┘ (loader runs again)
      └── Add dialog ── POST /api/ingredients ── router.refresh()

Recipe forms ──▶ loader catalogue → ingredient options
Shopping list ──▶ unit converter
```

| Component               | Module type                        | Responsibility                                          | Public API surface                                                |
| ----------------------- | ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Catalogue boundary      | Server query, page actions and API | List and mutate ingredient rows                         | `listIngredients`, update/delete actions, `POST /api/ingredients` |
| Settings management     | Route and Svelte components        | Search, display, and authority-gated management UI      | `/settings/ingredients`, `AddIngredient`                          |
| Form and option adapter | Shared feature components and hook | Collect metadata and expose `{ label, value }` choices  | `IngredientForm`, `useIngredientOptions`                          |
| Measurement contract    | Schema and utility                 | Define usable units and transform compatible quantities | `unitSlugSchema`, `convert()`                                     |

## 8. Detailed Design

### 8.1 Catalogue loader and mutation contract

The ingredient shape is `{ id, name, category, parentId, densityGPerMl, countWeightG,
preferredUnitSlug }`. `category` is one of `meat`, `fish`, `vegetables`, `spices`, or `other`; the
row defaults to `other` and indexes that column (`src/db/schema/ingredient.ts`).

| Field               | Meaning                          | Validity rule                           |
| ------------------- | -------------------------------- | --------------------------------------- |
| `name`              | Human-facing catalogue name      | At least two characters                 |
| `category`          | Stable grouping identifier       | One of the five catalogue categories    |
| `parentId`          | Optional variant grouping        | Optional integer; no enforced reference |
| `densityGPerMl`     | Volume-to-mass fact              | Nullable, finite value at least zero    |
| `countWeightG`      | Count-to-mass fact               | Nullable, finite value at least zero    |
| `preferredUnitSlug` | Shopping-list display preference | Nullable unit from `UNITS`              |

`listIngredients(db)` returns rows in ascending name order. The settings loader calls `guardPage`
before reading and returns `{ ingredients, isAdmin }`; recipe loaders can reuse the same server query
(`src/features/ingredients/server/queries.ts`, `pages/settings/ingredients/index.server.ts`).

Creation keeps `POST /api/ingredients` for both settings and inline recipe-editor use. Update and delete
are named actions at `/settings/ingredients?update` and `/settings/ingredients?delete`. Creation and
update require `withAuthGuard`; delete requires `withAuthGuard(handler, 'admin')`. The shared schemas
validate name, category, optional parent, non-negative conversion metadata, unit slug, and mutation ID
(`src/features/ingredients/schemas.ts`). Successful actions rerun the settings loader. API creation
calls `router.refresh()` to reload whichever page owns the catalogue; it does not depend on a browser
query cache (`src/features/ingredients/client/components/add-ingredient.svelte`). Expected failures retain form
values and display French error feedback.

### 8.2 Settings management

The regular Void page wraps its content in `IngredientCatalogProvider ingredients={ingredients}`.
The management view filters name and stored category case-insensitively and shows distinct French empty
messages for an empty query and an unmatched query. It always shows addition; edit and deletion controls
appear only for loader-resolved administrators (`src/features/ingredients/client/components/ingredients-management.svelte`).
Category badges pair the central icon with the French label on medium and wider viewports
(`src/components/ingredient-categories.ts`).

The management list remains a catalogue view: each row carries the ingredient name and category
badge, while editing metadata lives in the dialog flow. The empty state distinguishes a catalogue
without entries from a query that selects no row, so the screen gives a useful French explanation
in either case.

### 8.3 Form and option adapter

One form renders name, category, parent, density, item weight, and preferred unit. Its empty unit
choice represents no preference, and parent choices permit no parent (`src/features/ingredients/client/components/ingredient-form.svelte`).
Add accepts a name for prefill; add and edit dynamically validate and close on successful mutation
(`src/features/ingredients/client/components/add-ingredient.svelte`; `src/features/ingredients/client/components/edit-ingredient.svelte`).
`useIngredientOptions` maps provider-supplied loader rows to the unchanged combobox contract
`{ label: name, value: id }` (`src/features/ingredients/client/hooks/use-ingredient-options.svelte.ts`).
`AddIngredient` and `renderAddIngredientOption` retain their export names and prefill/trigger props;
TanStack Form still owns field state and validation.

The editing form maps a stored null parent to an absent form selection, allowing the combobox to
represent no parent without submitting a synthetic ID (`src/features/ingredients/client/components/edit-ingredient.svelte`).

### 8.4 Measurement contract

`UNITS` defines each slug's dimension, optional parent, and scale factor; `unitSlugSchema` constrains
stored preferences to that catalogue (`src/utils/units.ts`, `src/utils/unit-slug-schema.ts`). `convert(quantity, fromSlug,
toSlug, ingredient)` follows this flow:

```text
source quantity → canonical base → dimension bridge through grams → target unit
                         │                    │
                  validate chain       density or count weight
```

Mass is already grams; volume requires `densityGPerMl`; count requires `countWeightG`. The utility
rejects unavailable bridges, invalid factors, unknown units, and every cross-dimension length
conversion rather than guessing (`src/utils/unit-converter.ts`).

## Outcome and acceptance

- `[SO-1]` Settings and inline recipe forms use loader-owned ingredient lists without a Query cache.
  `[VC-1]` Given either page, adding an ingredient refreshes its list and parent-picker options.
- `[SO-2]` Guarded page actions preserve edit/delete authority and fresh management rows.
  `[VC-2]` Updating a throwaway ingredient displays its new name; deleting it removes the row. Direct
  anonymous writes fail, and direct non-admin deletion fails even when bypassing the hidden control.
- `[SO-3]` Existing French forms and metadata contracts remain unchanged.
  `[VC-3]` Invalid input remains editable with validation feedback; successful add/edit closes and resets
  the dialog, and the settings list retains search and category presentation.

## 9. Open Questions

N/A
