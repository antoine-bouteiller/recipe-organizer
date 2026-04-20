---
title: Ingredients
status: amended
author: Antoine Bouteiller
date: 2026-04-18
related: [../recipe/spec/index.spec.md, ../shopping-list/shopping-list.spec.md, ../../../docs/specs/unit.spec.md]
---

## 2. Problem Statement

Recipes reference ingredients as structured data, not free text, so the app can:

- `[G-1]` Group shopping-list items by ingredient category (meat, fish, vegetables, spices, other).
- `[G-2]` Auto-tag a recipe as `vegetarian` by checking whether any of its ingredients (or linked sub-recipe
  ingredients) fall in `meat` / `fish`. See `[KD-2]` of recipe spec.
- `[G-3]` Collapse ingredient variants (e.g., "cherry tomato" → parent "tomato") so a shopping list adding multiple
  recipes that each use a different tomato variant does not show three separate lines.
- `[G-4]` Let any authenticated user add a new ingredient on the fly while editing a recipe, without needing admin
  privileges — friction-free recipe entry matters more than perfect taxonomy hygiene.
- `[G-5]` Carry per-ingredient conversion metadata (density, count weight, preferred display unit) so the
  shopping list can aggregate quantities across unit dimensions and present a single meaningful "buy this much"
  value per ingredient.

## 3. Key Design Decisions

| Decision                                   | Choice                                                                                      | Rationale                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ | --------------------- | ----------------------------------------------------------------------------------------- |
| `[KD-1]` Flat table, optional `parentId`   | Self-referential `ingredient.parent_id` (no depth limit enforced, but used as single level) | Simplest model that covers the variant case without requiring a separate taxonomy system.                                                                                                                                                                           |
| `[KD-2]` Closed category set               | `meat                                                                                       | fish                                                                                                                                                                                                                                                                | vegetables | spices | other` (Drizzle enum) | Categories drive auto-tagging and UI icons; an open set would break vegetarian detection. |
| `[KD-3]` Create/update = any auth user     | `authGuard()` (no role)                                                                     | Recipe editing flow needs inline ingredient creation.                                                                                                                                                                                                               |
| `[KD-4]` Delete = admin only               | `authGuard('admin')`                                                                        | Deletes are referenced by `group_ingredients.ingredient_id` with `onDelete: 'restrict'` — breaking data is admin-only.                                                                                                                                              |
| `[KD-5]` Indexed by category               | `idx_ingredients_category`                                                                  | Shopping list groups by category; queries on large ingredient tables stay fast.                                                                                                                                                                                     |
| `[KD-6]` Conversion metadata on ingredient | `density_g_per_ml`, `count_weight_g`, `preferred_unit_slug` — all nullable                  | Per-ingredient physical properties belong to the ingredient, not the unit (1 g of flour ≠ 1 g of honey). Nullable so ingredients can be added without blocking on unknown data. `preferred_unit_slug` references the hardcoded unit catalog by slug, with no DB FK. |

## 4. Principles & Intents

- `[PI-1]` **Ingredients are shared, not per-user** — there is no `createdBy` field and no per-user visibility. The
  catalog is a single shared vocabulary.
- `[PI-2]` **Categories are the contract** — auto-tagging, icon selection, and shopping-list grouping all depend on
  the 5-value enum. Adding a new category is a breaking change that requires updating `isVegetarian` logic,
  `ingredientCategoryIcons`, and `ingredientCategoryLabels`.
- `[PI-3]` **Parent–child is for variants only** — "cherry tomato" → "tomato", not a general taxonomy. The child
  inherits nothing automatically (not even category); both rows are independent records.
- `[PI-4]` **Conversion metadata is best-effort, not required** — shopping-list aggregation must keep working when
  density / count weight / preferred unit are absent; the conversion engine falls back to a per-unit breakdown.
  Missing metadata is a nudge to the admin, not a blocker for recipe entry.
- `[PI-5]` **One density per ingredient** — packed-vs-sifted flour, melted-vs-solid butter etc. collapse into a
  single representative value. Precision is deliberately traded for simplicity.

## 5. Non-Goals

- `[NG-1]` Per-user ingredient catalogs.
- `[NG-2]` Nutritional data, allergen tracking, or pricing — density and count weight are the only physical
  metadata stored.
- `[NG-3]` Ingredient aliases / synonyms — use parent/child for variants, not for aliasing.
- `[NG-4]` Bulk import / CSV seeding UI (may exist in `scripts/` as a dev-only tool, but not a product feature).
- `[NG-5]` State-dependent density (packed / sifted / melted variants). One value per ingredient; see `[PI-5]`.
- `[NG-6]` Per-ingredient unit overrides beyond the three scalar fields (density, count weight, preferred unit).
  A richer `ingredient_unit_overrides` table is explicitly not in scope.

## 6. Caveats

- `[C-1]` `parentId` is an integer with no FK reference declared in the Drizzle schema (see
  `src/lib/db/schema/ingredient.ts`). Orphaned parent references are possible if an admin deletes a parent
  ingredient that has children. Intentionally relaxed — children should be re-parented or deleted by hand.
- `[C-2]` Delete is hard — `onDelete: 'restrict'` on `group_ingredients.ingredient_id` means deletion fails if any
  recipe still references the ingredient. The UI must surface this error cleanly.
- `[C-3]` There is no uniqueness constraint on `name`. Duplicate names (same or different category) are permitted
  by the schema. The UI should dedupe by ID, not by name.
- `[C-4]` `preferred_unit_slug` is validated against the hardcoded `UNITS` catalog at the API boundary via
  `unitSlugSchema`. Rows written before a slug is removed from the catalog may become orphans; the conversion
  engine tolerates this by treating an unknown slug as "no preferred unit" and falling back to the first seen
  unit across the cart.
- `[C-5]` `density_g_per_ml` and `count_weight_g` are free-form positive reals with no sanity range. Entering
  `100` grams per egg is accepted by the schema; operator error is the user's problem.

## 7. High-Level Components

| Component               | Module type      | Responsibility                                                 | Public API surface                                                                                                |
| ----------------------- | ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Ingredients list reader | Server function  | Return all ingredients (with optional parent info)             | `getIngredientsList()`                                                                                            |
| Ingredient CRUD         | Server functions | Create / update / delete ingredients                           | `createIngredientOptions()`, `updateIngredientOptions()`, `deleteIngredientOptions()` (mutation option factories) |
| Ingredient form         | React component  | Reusable field group for add + edit dialogs                    | `<IngredientForm />` via `withFieldGroup`                                                                         |
| Add/Edit/Delete dialogs | React components | Dialog wrappers around the form + mutation                     | `<AddIngredient />`, `<EditIngredient />`, `<DeleteIngredient />`                                                 |
| Category badge          | React component  | Render a category pill with icon (used in lists + forms)       | `<IngredientBadge />`                                                                                             |
| Settings page           | Route            | Searchable list + CRUD entry points                            | `GET /settings/ingredients`                                                                                       |
| Zod schemas             | Shared           | `ingredientSchema`, `updateIngredientSchema` (create + update) | Exported from `api/create.ts`, `api/update.ts`                                                                    |

## 8. Detailed Design

| Component               | Entry point                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| List reader             | `src/features/ingredients/api/get-all.ts` → `getIngredientsList`                               |
| Create                  | `src/features/ingredients/api/create.ts` → `createIngredientOptions`, `ingredientSchema`       |
| Update                  | `src/features/ingredients/api/update.ts` → `updateIngredientOptions`, `updateIngredientSchema` |
| Delete                  | `src/features/ingredients/api/delete.ts` → `deleteIngredientOptions`                           |
| Form (field group)      | `src/features/ingredients/components/ingredient-form.tsx`                                      |
| Add dialog              | `src/features/ingredients/components/add-ingredient.tsx`                                       |
| Edit dialog             | `src/features/ingredients/components/edit-ingredient.tsx`                                      |
| Delete confirmation     | `src/features/ingredients/components/delete-ingredient.tsx`                                    |
| Category badge          | `src/features/ingredients/components/ingredient-badge.tsx`                                     |
| Category labels / icons | `src/features/ingredients/utils/constants.tsx`                                                 |
| Settings route          | `src/routes/settings/ingredients.tsx`                                                          |
| DB schema               | `src/lib/db/schema/ingredient.ts` (`ingredientCategory` enum + table)                          |
| Query key               | `src/lib/query-keys.ts` → `queryKeys.listIngredients()`                                        |

Validation rules baked into `ingredientSchema` (any change needs spec update):

- `name`: string, min length 2.
- `category`: must be one of `ingredientCategory`.
- `parentId`: optional integer.
- `densityGPerMl`: optional positive number (`> 0`). Typical range `0.3 – 1.5`, but not enforced.
- `countWeightG`: optional positive number (`> 0`).
- `preferredUnitSlug`: optional `UnitSlug` — validated via `unitSlugSchema` (Zod enum over `UNITS` keys). Stored
  as `TEXT` with no DB FK.
- Update schema extends create with required `id: number`.

The schema persists conversion metadata but does not perform the conversion. All conversion logic lives in
`docs/specs/unit.spec.md` and its implementation at `src/utils/unit-converter.ts`.

## 9. Verification Criteria

- `[VC-1]` `createIngredient` rejects `name` shorter than 2 chars with a Zod validation error.
- `[VC-2]` `createIngredient` rejects an unknown `category`.
- `[VC-3]` Non-admin authenticated users CAN create and update ingredients (`authGuard()` with no role).
- `[VC-4]` Non-admin authenticated users CANNOT delete ingredients (`authGuard('admin')` throws
  `Permission denied`).
- `[VC-5]` Deleting an ingredient that is still referenced by any `group_ingredients` row fails (DB FK
  `restrict`); the UI surfaces the error via `toastError`.
- `[VC-6]` After create/update/delete, `queryKeys.listIngredients()` is invalidated and the settings list
  re-renders.
- `[VC-7]` Success toasts include the ingredient name (create + update), failure toasts include a French error
  string.
- `[VC-8]` `/settings/ingredients` search filters by name prefix match case-insensitively.
- `[VC-9]` `createIngredient` and `updateIngredient` accept `densityGPerMl` and `countWeightG` when absent,
  null, or positive numeric; reject `0` or negative values.
- `[VC-10]` `createIngredient` and `updateIngredient` reject a `preferredUnitSlug` that is not a key of `UNITS`
  via `unitSlugSchema`.
- `[VC-11]` `updateIngredient` tolerates a pre-existing `preferredUnitSlug` value that is no longer in `UNITS`
  (row is not rewritten on read); the ingredient form exposes the value as "unit introuvable" and lets the
  admin clear or replace it.
- `[VC-12]` The ingredient form in `/settings/ingredients` exposes three new fields: density, count weight,
  preferred unit (select populated from `UNITS`, grouped by dimension).
- `[VC-13]` Lint + typecheck pass: `pnpm lint`, `pnpm typecheck`.

## 10. Open Questions

- `[OQ-1]` Should delete cascade to `group_ingredients` instead of restricting? Today the admin must manually
  clean up references. No change planned until it becomes a real pain point.
- `[OQ-2]` Should we enforce uniqueness on `(name, category, parentId)` or similar, to prevent accidental
  duplicates?

## Changelog

| Date       | Amendment                                                                           | Sections affected   | Reason                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| 2026-04-18 | Add `density_g_per_ml`, `count_weight_g`, `preferred_unit_id` to the ingredient row | 2, 3, 4, 5, 6, 8, 9 | Feeds the shopping-list conversion engine (`docs/specs/unit.spec.md`) so aggregated quantities are actionable. |
| 2026-04-18 | Rename `preferred_unit_id INT` → `preferred_unit_slug TEXT`; drop DB FK             | 3, 6, 8, 9          | Units moved to a hardcoded catalog (`src/lib/db/schema/unit.ts`); slug is now the stable persisted identity.   |
