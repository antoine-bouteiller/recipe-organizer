---
title: Units
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related: [../recipe/spec/index.spec.md, ../shopping-list/shopping-list.spec.md]
---

## 2. Problem Statement

Ingredient quantities in recipes use units ("200g", "2 cups"). The app needs a managed catalog of units so that:

- `[G-1]` Recipe forms can offer a typed, consistent picker (not free-text).
- `[G-2]` Units can be expressed relative to another unit via a conversion `factor` (e.g., `1 kg = 1000 × g`),
  enabling future unit conversions for the shopping list or ingredient scaling.
- `[G-3]` Unitless ingredients ("1 egg", "à goût") are representable — the unit is optional on
  `group_ingredients`.
- `[G-4]` Only admins can modify the shared unit catalog, because the unit list is user-facing and breaking it
  (renaming `g` to something else, or deleting `ml`) affects every recipe.

## 3. Key Design Decisions

| Decision                          | Choice                                                              | Rationale                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Hierarchical with factor | `unit.parent_id` + `unit.factor` (nullable)                         | Simplest model for unit conversions; `factor` = "how many parent units per this unit" (e.g., `kg`.factor = 1000 with parent `g`). |
| `[KD-2]` Admin-only CRUD          | `authGuard('admin')` on create / update / delete                    | Units are shared vocabulary; accidental edits break every recipe.                                                                 |
| `[KD-3]` Optional FK on usage     | `group_ingredients.unit_id` is nullable with `onDelete: 'set null'` | Deleting a unit does not invalidate the containing recipe — the quantity becomes unitless, which is still valid data.             |
| `[KD-4]` No FK on `parent_id`     | Plain `integer('parent_id')`, no `references()`                     | Matches ingredient pattern; admins manage hierarchy manually, orphaned references allowed.                                        |

## 4. Principles & Intents

- `[PI-1]` **Admin-only write path** — all mutations require `role === 'admin'`. No inline "create unit" from the
  recipe form (unlike ingredients).
- `[PI-2]` **Nullable unit on ingredient lines is load-bearing** — UI and conversion logic must handle
  `unit = null` (e.g., "1 egg") without throwing.
- `[PI-3]` **Factor is optional** — base units (no parent) have no factor; derived units must have both `parent_id`
  and `factor` for any future conversion logic to work.

## 5. Non-Goals

- `[NG-1]` Automatic unit conversion in the UI at read time — today, the recipe displays whatever unit was
  entered. Factor-based conversion is a future lever.
- `[NG-2]` Locale-aware unit names (imperial / metric toggle).
- `[NG-3]` Unit aliases (`g` vs `gram` vs `grams`).
- `[NG-4]` Unit validation against category (e.g., forbidding `ml` on a solid ingredient).

## 6. Caveats

- `[C-1]` Deleting a unit that is referenced by recipes succeeds — `onDelete: 'set null'` clears the FK on
  affected `group_ingredients` rows. The recipe will then render quantities without a unit. Admins should
  sanity-check before deleting.
- `[C-2]` No uniqueness constraint on `name`. Duplicates (e.g., two rows both called `g`) are permitted by the
  schema.
- `[C-3]` `factor` can be `0` rejected (Zod `min(0)`) but `factor = 0` on the DB column itself is not prevented
  by a CHECK constraint — rely on the Zod validator at the API boundary.

## 7. High-Level Components

| Component         | Module type      | Responsibility                                   | Public API surface                                                  |
| ----------------- | ---------------- | ------------------------------------------------ | ------------------------------------------------------------------- |
| Units list reader | Server function  | Return all units (with parent info)              | `getUnitsList()`                                                    |
| Unit CRUD         | Server functions | Create / update / delete units (admin only)      | `createUnitOptions()`, `updateUnitOptions()`, `deleteUnitOptions()` |
| Unit form         | React component  | Reusable field group for add + edit dialogs      | `<UnitForm />` via `withFieldGroup`                                 |
| Add/Edit/Delete   | React components | Dialog wrappers around form + mutations          | `<AddUnit />`, `<EditUnit />`, `<DeleteUnit />`                     |
| Settings page     | Route            | Searchable list + CRUD entry points (admin only) | `GET /settings/units`                                               |
| Zod schemas       | Shared           | `unitSchema`, `updateUnitSchema`                 | Exported from `api/create.ts`, `api/update.ts`                      |

## 8. Detailed Design

| Component          | Entry point                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| List reader        | `src/features/units/api/get-all.ts` → `getUnitsList`                         |
| Create             | `src/features/units/api/create.ts` → `createUnitOptions`, `unitSchema`       |
| Update             | `src/features/units/api/update.ts` → `updateUnitOptions`, `updateUnitSchema` |
| Delete             | `src/features/units/api/delete.ts` → `deleteUnitOptions`                     |
| Form (field group) | `src/features/units/components/unit-form.tsx`                                |
| Add dialog         | `src/features/units/components/add-unit.tsx`                                 |
| Edit dialog        | `src/features/units/components/edit-unit.tsx`                                |
| Delete confirm     | `src/features/units/components/delete-unit.tsx`                              |
| Settings route     | `src/routes/settings/units.tsx`                                              |
| DB schema          | `src/lib/db/schema/unit.ts`                                                  |
| Query key          | `src/lib/query-keys.ts` → `queryKeys.allUnits`                               |

Validation rules in `unitSchema`:

- `name`: string, min length 2.
- `factor`: optional non-negative number.
- `parentId`: optional integer.
- Update schema extends create with required `id: number`.

## 9. Verification Criteria

- `[VC-1]` Non-admin users CANNOT create/update/delete units — `authGuard('admin')` throws `Permission denied`.
- `[VC-2]` `unitSchema` rejects `name` shorter than 2 chars and `factor < 0`.
- `[VC-3]` Deleting a unit that is referenced by `group_ingredients` succeeds and sets those rows'
  `unit_id = NULL`.
- `[VC-4]` After create/update/delete, `queryKeys.allUnits` is invalidated and `/settings/units` re-renders.
- `[VC-5]` Success and failure toasts use French copy and include the unit name.
- `[VC-6]` A unit row with `parentId` set but `factor` absent is representable but does not participate in any
  conversion logic today (no runtime error).
- `[VC-7]` Lint + typecheck pass: `pnpm lint`, `pnpm typecheck`.

## 10. Open Questions

- `[OQ-1]` Should we require `factor` whenever `parentId` is set (schema-level invariant)? Currently optional.
- `[OQ-2]` Should the shopping list perform unit conversion (e.g., aggregate `200g` + `0.5 kg` as `700g`) using
  the factor chain? Not implemented today — each ingredient line is grouped by `(ingredientId, unitId)` verbatim.
