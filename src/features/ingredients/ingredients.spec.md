---
title: Ingredients
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
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
| `[KD-3]` Read coherence        | The catalogue has one query key, and every mutation invalidates it.                                                        | Settings and recipe-form consumers observe the refreshed list following a write.                            |
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
  can leave a child reference (`db/schema/ingredient.ts:12-21`).
- `[C-2]` A conversion returns no value when a unit chain is malformed, input is non-finite, or density/count
  weight needed to bridge dimensions is absent or non-positive (`src/utils/unit-converter.ts:11-79`).
- `[C-3]` The category index supports category-oriented access but the settings search filters the fetched
  list in the browser (`db/schema/ingredient.ts:23-25`; `src/routes/settings/ingredients.tsx:21-25`).

## 7. High-Level Components

```text
Settings route ──query──▶ Catalogue API ──▶ D1 ingredient rows
      │                       │
      │                       └── invalidates list query on mutation success
      └── Add / Edit / Delete dialogs

Recipe forms ──▶ ingredient options       Shopping list ──▶ unit converter
```

| Component               | Module type                        | Responsibility                                          | Public API surface                           |
| ----------------------- | ---------------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Catalogue API           | Server functions and query options | List and mutate ingredient rows                         | `getIngredientListOptions`, mutation options |
| Settings management     | Route and React components         | Search, display, and authority-gated management UI      | `/settings/ingredients`, `AddIngredient`     |
| Form and option adapter | Shared feature components and hook | Collect metadata and expose `{ label, value }` choices  | `IngredientForm`, `useIngredientOptions`     |
| Measurement contract    | Schema and utility                 | Define usable units and transform compatible quantities | `unitSlugSchema`, `convert()`                |

## 8. Detailed Design

### 8.1 Catalogue API

The ingredient shape is `{ id, name, category, parentId, densityGPerMl, countWeightG,
preferredUnitSlug }`. `category` is one of `meat`, `fish`, `vegetables`, `spices`, or `other`; the
row defaults to `other` and indexes that column (`db/schema/ingredient.ts:3-25`).

| Field               | Meaning                          | Validity rule                           |
| ------------------- | -------------------------------- | --------------------------------------- |
| `name`              | Human-facing catalogue name      | At least two characters                 |
| `category`          | Stable grouping identifier       | One of the five catalogue categories    |
| `parentId`          | Optional variant grouping        | Optional integer; no enforced reference |
| `densityGPerMl`     | Volume-to-mass fact              | Nullable, finite value at least zero    |
| `countWeightG`      | Count-to-mass fact               | Nullable, finite value at least zero    |
| `preferredUnitSlug` | Shopping-list display preference | Nullable unit from `UNITS`              |

The list server function returns rows in ascending name order under `queryKeys.listIngredients()`
(`src/features/ingredients/api/get-all.ts:7-22`). Create and update require `authGuard()` and parse
name, category, optional parent, positive-or-zero conversion fields, and optional unit slug
(`src/features/ingredients/api/create.ts:12-31`; `src/features/ingredients/api/update.ts:15-28`).
Delete requires `authGuard('admin')` (`src/features/ingredients/api/delete.ts:13-21`). Each mutation
invalidates the list key; create and update also deliver French success or failure feedback
(`src/features/ingredients/api/create.ts:33-51`; `src/features/ingredients/api/update.ts:30-48`).

A list read is intentionally public at this boundary; mutation guards determine who may alter the
catalogue. The route-level visibility gate complements that server decision and never replaces it.

### 8.2 Settings management

The route prefetches the catalogue, filters its name and stored category case-insensitively, and
shows distinct French empty messages for an empty query and an unmatched query
(`src/routes/settings/ingredients.tsx:18-25`; `src/routes/settings/ingredients.tsx:38-42`). It always
shows addition; edit and deletion controls appear only for route-context administrators
(`src/routes/settings/ingredients.tsx:29-35`; `src/routes/settings/ingredients.tsx:47-51`). Category
badges pair the central icon with the French label on medium and wider viewports
badges pair the central icon with the French label on medium and wider viewports
(`src/routes/settings/ingredients.tsx:57-63`; `src/components/ingredient-category.tsx:6-25`).

The management list remains a catalogue view: each row carries the ingredient name and category
badge, while editing metadata lives in the dialog flow. The empty state distinguishes a catalogue
without entries from a query that selects no row, so the screen gives a useful French explanation
in either case.

### 8.3 Form and option adapter

One form renders name, category, parent, density, item weight, and preferred unit. Its empty unit
choice represents no preference, and parent choices permit no parent (`src/features/ingredients/components/ingredient-form.tsx:11-43`).
Add accepts a name for prefill; add and edit dynamically validate and close on successful mutation
(`src/features/ingredients/components/add-ingredient.tsx:19-49`; `src/features/ingredients/components/edit-ingredient.tsx:23-59`).
`useIngredientOptions` maps catalogue rows to the combobox contract `{ label: name, value: id }`
(`src/features/ingredients/hooks/use-ingredient-options.ts:1-6`).

The editing form maps a stored null parent to an absent form selection, allowing the combobox to
represent no parent without submitting a synthetic ID (`src/features/ingredients/components/edit-ingredient.tsx:23-33`).

### 8.4 Measurement contract

`UNITS` defines each slug's dimension, optional parent, and scale factor; `unitSlugSchema` constrains
stored preferences to that catalogue (`db/schema/unit.ts:3-57`). `convert(quantity, fromSlug,
toSlug, ingredient)` follows this flow:

```text
source quantity → canonical base → dimension bridge through grams → target unit
                         │                    │
                  validate chain       density or count weight
```

Mass is already grams; volume requires `densityGPerMl`; count requires `countWeightG`. The utility
rejects unavailable bridges, invalid factors, unknown units, and every cross-dimension length
conversion rather than guessing (`src/utils/unit-converter.ts:81-154`).

## 9. Open Questions

N/A
