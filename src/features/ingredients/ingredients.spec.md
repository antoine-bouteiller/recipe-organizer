---
title: Ingredients Feature Specification
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [feature, ingredients, crud, units]
---

# Introduction

This specification documents the `ingredients` feature of `recipe-organizer`, a TanStack Start + Cloudflare
Workers application. The feature provides the canonical catalogue of ingredients used by recipes and the
shopping list. It owns the ingredient entity and its associated unit metadata (density, unit weight,
preferred shopping unit), the CRUD server functions backing the catalogue, the UI for the
`/settings/ingredients` administration screen, and the unit-conversion utilities used by other features.

## 1. Purpose & Scope

- **Purpose.** Maintain a single, validated, queryable list of ingredients with category, hierarchy
  (parent / child), and unit-conversion metadata so recipes and shopping list aggregation can reason about
  quantities across mass, volume, and count dimensions.
- **In scope.**
  - Ingredient entity definition and persistence (Drizzle + Cloudflare D1).
  - Server functions: list, create, update, delete.
  - Form, dialogs, and badge components used by the settings page.
  - Category metadata (labels, icons, color styles) and combobox option hook.
  - Unit catalogue (`UNITS`, `UnitSlug`, `unitOptions`, `unitSlugSchema`) and `convert()` helper.
- **Out of scope.**
  - Recipe ingredient lines and recipe-level quantities (see `../recipe/spec/index.spec.md`).
  - Shopping list aggregation rules beyond the spice exclusion noted here (see
    `../shopping-list/shopping-list.spec.md`).
  - Authentication and authorization mechanics (see `../auth`).

## 2. Definitions

| Term                   | Definition                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ingredient             | A row in the `ingredients` table representing a foodstuff usable in recipes.                                                                           |
| Category               | One of `meat`, `fish`, `vegetables`, `spices`, `other` — controls grouping, badge, and shopping-list rules.                                            |
| Parent ingredient      | An optional self-referencing pointer (`parentId`) used to group variants (e.g. `tomato` as parent of `cherry tomato`).                                 |
| `densityGPerMl`        | Density in grams per millilitre; enables volume ↔ mass conversion.                                                                                     |
| `countWeightG`         | Average mass in grams of one unit/piece of the ingredient; enables count ↔ mass conversion.                                                            |
| `preferredUnitSlug`    | The unit the shopping list prefers when displaying this ingredient.                                                                                    |
| Unit                   | A measurement entry from `UNITS` carrying `slug`, `name`, `dimension`, `parent`, and `factor`.                                                         |
| `Dimension`            | One of `mass`, `volume`, `count`, `length`.                                                                                                            |
| Canonical base unit    | A unit whose `parent` is `null` within its dimension (`g` for mass, `ml` for volume, each count/length unit).                                          |
| `UnitSlug`             | Discriminated string union: `g`, `kg`, `ml`, `l`, `tbsp`, `tsp`, `piece`, `pinch`, `cube`, `bottle`, `sheet`, `box`, `can`, `handful`, `packet`, `cm`. |
| `convert()`            | Function that converts a quantity between two `UnitSlug`s using ingredient density / count weight to bridge dimensions through grams.                  |
| `useIngredientOptions` | Hook returning the ingredient list shaped as combobox options for forms.                                                                               |
| Admin                  | A user whose route context exposes `isAdmin === true`; required for `deleteIngredient` and for the Edit/Delete actions on the settings page.           |

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

- **REQ-001.** The `ingredients` table MUST persist columns `id` (integer primary key), `name` (text, not
  null), `category` (text enum, not null, default `other`), `parentId` (integer, nullable),
  `densityGPerMl` (real, nullable), `countWeightG` (real, nullable), `preferredUnitSlug` (text, nullable,
  typed as `UnitSlug`).
- **REQ-002.** The `ingredients` table MUST declare an index `idx_ingredients_category` on `category`.
- **REQ-003.** The category enum MUST be exactly `['meat', 'fish', 'vegetables', 'spices', 'other']`.
- **REQ-004.** `getIngredientsList` MUST be a `GET` server function that returns all ingredients ordered by
  `name` ascending and MUST NOT require authentication.
- **REQ-005.** `getIngredientListOptions()` MUST return TanStack Query `queryOptions` keyed by
  `queryKeys.listIngredients()` and using `getIngredientsList` as `queryFn`.
- **REQ-006.** `createIngredient` MUST require authentication via `authGuard()` and validate input with
  `ingredientSchema`.
- **REQ-007.** `updateIngredient` MUST require authentication via `authGuard()` and validate input with
  `updateIngredientSchema` (which extends `ingredientSchema` with `id: number`).
- **REQ-008.** `deleteIngredient` MUST require admin authorization via `authGuard('admin')` and validate
  input with `{ id: number }`.
- **REQ-009.** `ingredientSchema` MUST enforce: `name` string of min length 2; `category` enum from
  `ingredientCategory`; `densityGPerMl` and `countWeightG` positive numbers, nullable, optional;
  `parentId` number, optional; `preferredUnitSlug` validated by `unitSlugSchema`, nullable, optional.
- **REQ-010.** Mutations (`createIngredient`, `updateIngredient`, `deleteIngredient`) MUST invalidate
  `queryKeys.listIngredients()` on success.
- **REQ-011.** `createIngredient` and `updateIngredient` MUST display a French success toast referencing
  the ingredient name and a French error toast on failure via `toastError`.
- **REQ-012.** `IngredientForm` MUST render fields for `name`, `category`, `parentId`, `densityGPerMl`,
  `countWeightG`, and `preferredUnitSlug`, with French labels.
- **REQ-013.** The `preferredUnitSlug` select MUST include an `Aucune` (empty value) option in addition to
  `unitOptions`.
- **REQ-014.** `AddIngredient` MUST accept an optional `defaultValue` prop that pre-fills the `name` field.
- **REQ-015.** `AddIngredient` and `EditIngredient` MUST use `useAppForm` with
  `validationLogic: revalidateLogic()` and `validators.onDynamic: ingredientSchema`, and MUST be wrapped in
  the dialog returned by `getFormDialog(ingredientDefaultValues)`.
- **REQ-016.** On successful submit both dialogs MUST reset the form and close (`setOpen(false)`).
- **REQ-017.** `EditIngredient` MUST hydrate the form from the supplied `Ingredient`, mapping `parentId`
  `null` to `undefined`.
- **REQ-018.** `DeleteIngredient` MUST render a `DeleteDialog` with French copy and call
  `deleteMutation.mutate({ data: { id: ingredientId } })`.
- **REQ-019.** The `/settings/ingredients` route MUST preload `getIngredientListOptions()` via the route
  `loader` using `context.queryClient.ensureQueryData`.
- **REQ-020.** The settings page MUST filter ingredients case-insensitively by both `name` and `category`
  using a single search input.
- **REQ-021.** Edit and Delete actions on the settings page MUST be visible only when
  `Route.useRouteContext().isAdmin === true`.
- **REQ-022.** Each row MUST render an `IngredientBadge` with the category icon and (on viewports `md` and
  larger) the French category label.
- **REQ-023.** When the filtered list is empty, the page MUST show a French empty-state message
  distinguishing between "no search results" and "no ingredients yet".
- **REQ-024.** `useIngredientOptions` MUST expose ingredients as combobox `{ label, value }` options for
  reuse by recipes; the `parentId` field of `IngredientForm` MUST consume it with `allowEmpty: true`.

### 3.2 Unit & Conversion Requirements

- **REQ-025.** `UNITS` MUST contain exactly the 16 entries defined in `src/lib/db/schema/unit.ts` with
  their declared `dimension`, `parent`, and `factor` values.
- **REQ-026.** `kg` MUST resolve to `g` via factor `1000`; `l` MUST resolve to `ml` via factor `1000`;
  `tbsp` MUST resolve to `ml` via factor `15`; `tsp` MUST resolve to `ml` via factor `5`. All other units
  MUST be canonical (`parent: null`, `factor: null`).
- **REQ-027.** `unitSlugSchema` MUST be a Zod enum derived from the keys of `UNITS`.
- **REQ-028.** `convert(quantity, fromSlug, toSlug, ingredient)` MUST return `null` when:
  - `quantity` is not finite;
  - `fromSlug` or `toSlug` is unknown;
  - the unit chain exceeds `MAX_CHAIN_DEPTH` (16) without reaching a base;
  - a chain hop has a non-positive / non-finite `factor`;
  - bridging dimensions requires a missing or non-positive `densityGPerMl` (volume) or `countWeightG`
    (count);
  - converting to/from `length` from another dimension (no bridge defined).
- **REQ-029.** `convert()` MUST return the input quantity unchanged when `fromSlug === toSlug` and the
  slug exists in `UNITS`.
- **REQ-030.** Cross-dimension conversions MUST bridge through grams using `densityGPerMl` (volume ↔ mass)
  or `countWeightG` (count ↔ mass).

### 3.3 Constraints

- **CON-001.** Persistence runs on Cloudflare D1 via Drizzle (see `../../docs/infrastructure/data-layer.spec.md`).
- **CON-002.** Server-only modules (API files) MUST use `createServerFn` from `@tanstack/react-start` and
  obtain the database via `getDb()`.
- **CON-003.** All user-facing copy MUST be French; identifier strings (slugs, enum values) remain
  English.
- **CON-004.** Forms MUST go through `useAppForm`/`withForm` and the shared `getFormDialog` wrapper; no
  ad-hoc dialog or form state is permitted.
- **CON-005.** Only admins may delete ingredients; the server enforces this independently of the UI gate.
- **CON-006.** The ingredient `category` column has a database default of `other`; client code MUST NOT
  rely on missing-category behaviour beyond that default.
- **CON-007.** `parentId` is a plain integer column without a foreign-key constraint; orphan handling on
  parent deletion is not defined here.

### 3.4 Guidelines

- **GUD-001.** Reuse `IngredientForm` (a `withForm` definition) for both add and edit flows; do not
  duplicate field markup.
- **GUD-002.** Toast helpers (`toastManager.add`, `toastError`) are the canonical user-feedback channel
  for ingredient mutations.
- **GUD-003.** Prefer `ingredientCategoryLabels` and `ingredientCategoryIcons` for any UI rendering of a
  category to keep mapping centralised.
- **GUD-004.** Surface ingredients to other features through `useIngredientOptions` rather than re-reading
  the query directly when combobox options are needed.

### 3.5 Patterns

- **PAT-001.** Server function = `createServerFn().middleware([authGuard(...)]).inputValidator(zodSchema).handler(...)`.
- **PAT-002.** Mutation hook = `mutationOptions({ mutationFn, onError: toastError(..), onSuccess: invalidateQueries + toastManager.add })`.
- **PAT-003.** Form dialog = `getFormDialog(defaults)` + `useAppForm({ validationLogic: revalidateLogic(), validators: { onDynamic: schema } })` + `IngredientForm` body.
- **PAT-004.** Category metadata fan-out via three keyed records (`Labels`, `Icons`, badge `categoryStyles`) keyed by `IngredientCategory`.

## 4. Interfaces & Data Contracts

### 4.1 Database Schema (`ingredients`)

| Column                | Type              | Nullable | Default   | Notes                                                            |
| --------------------- | ----------------- | -------- | --------- | ---------------------------------------------------------------- |
| `id`                  | integer (PK)      | no       | —         | Primary key.                                                     |
| `name`                | text              | no       | —         | Display name.                                                    |
| `category`            | text enum         | no       | `'other'` | One of `meat`, `fish`, `vegetables`, `spices`, `other`. Indexed. |
| `parent_id`           | integer           | yes      | —         | Self-reference; no FK constraint.                                |
| `density_g_per_ml`    | real              | yes      | —         | Grams per millilitre.                                            |
| `count_weight_g`      | real              | yes      | —         | Grams per piece.                                                 |
| `preferred_unit_slug` | text (`UnitSlug`) | yes      | —         | Preferred shopping unit.                                         |

Index: `idx_ingredients_category` on `category`.

### 4.2 Zod Schemas

```ts
ingredientSchema = z.object({
  category: z.enum(ingredientCategory),
  countWeightG: z.number().positive().nullable().optional(),
  densityGPerMl: z.number().positive().nullable().optional(),
  name: z.string().min(2),
  parentId: z.number().optional(),
  preferredUnitSlug: unitSlugSchema.nullable().optional(),
})

updateIngredientSchema = ingredientSchema.extend({ id: z.number() })

deleteIngredientSchema = z.object({ id: z.number() })
```

### 4.3 Server Functions

| Name                 | HTTP | Auth                 | Input                    | Effect                                         |
| -------------------- | ---- | -------------------- | ------------------------ | ---------------------------------------------- |
| `getIngredientsList` | GET  | none                 | —                        | Returns all ingredients ordered by `name` asc. |
| `createIngredient`   | POST | `authGuard()`        | `ingredientSchema`       | Inserts a new row.                             |
| `updateIngredient`   | POST | `authGuard()`        | `updateIngredientSchema` | Updates row by `id`.                           |
| `deleteIngredient`   | POST | `authGuard('admin')` | `{ id }`                 | Deletes row by `id`.                           |

### 4.4 Query Keys & Mutation Side Effects

- Read key: `queryKeys.listIngredients()`.
- After `createIngredient` success: invalidate `listIngredients`; toast `Ingrédient {name} créé`.
- After `updateIngredient` success: invalidate `listIngredients`; toast `Ingrédient {name} mis à jour`.
- After `deleteIngredient` success: invalidate `listIngredients` (no toast).
- Errors:
  - create: `toastError("Erreur lors de la création de l'ingrédient", error)`.
  - update: `toastError("Erreur lors de la mise à jour de l'ingrédient {name}", error)`.

### 4.5 TypeScript Types

```ts
type Ingredient = InferSelectModel<typeof ingredient>
type IngredientCategory = (typeof ingredientCategory)[number]
type IngredientFormValues = z.infer<typeof ingredientSchema>
type IngredientFormInput = Partial<IngredientFormValues>
type UpdateIngredientFormValues = z.infer<typeof updateIngredientSchema>
type UpdateIngredientFormInput = Partial<UpdateIngredientFormValues>
```

### 4.6 Category Presentation

| Category     | French label          | Icon          | Badge classes                     |
| ------------ | --------------------- | ------------- | --------------------------------- |
| `meat`       | `Viandes`             | `CowIcon`     | `bg-red-200 text-red-600`         |
| `fish`       | `Poissons`            | `FishIcon`    | `bg-blue-200 text-blue-600`       |
| `vegetables` | `Légumes`             | `CarrotIcon`  | `bg-emerald-100 text-emerald-600` |
| `spices`     | `Epices & Condiments` | `PepperIcon`  | `bg-yellow-200 text-yellow-600`   |
| `other`      | `Autres`              | `PackageIcon` | `bg-zinc-200 text-zinc-700`       |

`ingredientsCategoryOptions` MUST be derived from `ingredientCategoryLabels` as `{ label, value }` pairs.

### 4.7 Unit Catalogue

| Slug      | Name         | Dimension | Parent | Factor |
| --------- | ------------ | --------- | ------ | ------ |
| `g`       | `g`          | mass      | —      | —      |
| `kg`      | `kg`         | mass      | `g`    | 1000   |
| `ml`      | `mL`         | volume    | —      | —      |
| `l`       | `L`          | volume    | `ml`   | 1000   |
| `tbsp`    | `tbsp`       | volume    | `ml`   | 15     |
| `tsp`     | `tsp`        | volume    | `ml`   | 5      |
| `piece`   | `piece(s)`   | count     | —      | —      |
| `pinch`   | `pinch(es)`  | count     | —      | —      |
| `cube`    | `cube(s)`    | count     | —      | —      |
| `bottle`  | `bottle(s)`  | count     | —      | —      |
| `sheet`   | `sheet(s)`   | count     | —      | —      |
| `box`     | `box(es)`    | count     | —      | —      |
| `can`     | `can(s)`     | count     | —      | —      |
| `handful` | `handful(s)` | count     | —      | —      |
| `packet`  | `packet(s)`  | count     | —      | —      |
| `cm`      | `cm`         | length    | —      | —      |

### 4.8 `convert()` Signature

```ts
convert(
  quantity: number,
  fromSlug: UnitSlug,
  toSlug: UnitSlug,
  ingredient: { densityGPerMl: number | null; countWeightG: number | null },
): number | null
```

Returns the converted quantity, or `null` when conversion is impossible (see REQ-028).

## 5. Acceptance Criteria

- **AC-001.** **Given** an authenticated user submits the add dialog with a valid name and category,
  **when** `createIngredient` resolves, **then** the ingredient is inserted, `listIngredients` is
  invalidated, a French success toast appears, the form resets, and the dialog closes.
- **AC-002.** **Given** an unauthenticated request to `createIngredient` or `updateIngredient`, **when**
  the server function executes, **then** `authGuard()` rejects the call before reaching the handler.
- **AC-003.** **Given** a non-admin user invokes `deleteIngredient`, **when** the server function
  executes, **then** `authGuard('admin')` rejects the call.
- **AC-004.** **Given** the user types a name shorter than 2 characters, **when** the form revalidates
  dynamically, **then** Zod reports a `name` validation error and submission is blocked.
- **AC-005.** **Given** an ingredient has `densityGPerMl = 0.55`, **when** `convert(100, 'ml', 'g',
ingredient)` is called, **then** it returns `55`.
- **AC-006.** **Given** an ingredient has `countWeightG = 50`, **when** `convert(2, 'piece', 'g',
ingredient)` is called, **then** it returns `100`.
- **AC-007.** **Given** an ingredient has `densityGPerMl = null`, **when** `convert(1, 'ml', 'g',
ingredient)` is called, **then** it returns `null`.
- **AC-008.** **Given** `convert(1, 'kg', 'g', _)` is called, **then** it returns `1000`; **given**
  `convert(1, 'tbsp', 'ml', _)`, **then** it returns `15`.
- **AC-009.** **Given** the settings page renders for a non-admin user, **when** the list is shown,
  **then** no Edit or Delete buttons appear on any row.
- **AC-010.** **Given** an admin types `poiss` in the search input, **when** the list re-renders,
  **then** only ingredients whose `name` or `category` contains `poiss` (case-insensitive) remain.
- **AC-011.** **Given** an admin opens the edit dialog for an ingredient with `parentId = null`,
  **when** the form initialises, **then** `parentId` is `undefined` (not `null`).
- **AC-012.** **Given** the create form is submitted, **when** `onSuccess` fires, **then**
  `queryKeys.listIngredients()` is invalidated and `getIngredientsList` is refetched.

## 6. Test Automation Strategy

- **Unit tests (Vitest, `vp test`).**
  - `convert()` covers same-unit, intra-dimension scaling (kg↔g, l↔ml, tbsp/tsp↔ml), volume↔mass via
    density, count↔mass via count weight, missing metadata returning `null`, unknown slugs, non-finite
    inputs.
  - `ingredientSchema` rejects invalid `name`, non-positive numerics, unknown category, unknown
    `preferredUnitSlug`.
- **Component tests.** Render `IngredientForm` inside an `useAppForm` host, verify field labels,
  default values, and disabled state during `isSubmitting`.
- **Integration / route tests.** Test the `/settings/ingredients` route with mocked
  `getIngredientListOptions` and route context to validate admin gating, search filtering, and
  empty-state messages.
- **Server function tests.** Exercise `createIngredient`, `updateIngredient`, `deleteIngredient` with the
  in-memory D1 binding to assert auth gating and DB effects, plus query invalidation on the client side.

## 7. Rationale & Context

- Storing `densityGPerMl` and `countWeightG` per ingredient lets recipes mix mass, volume, and count
  freely while letting the shopping list aggregate by a single canonical unit (grams).
- A self-referential `parentId` keeps variants browsable from a single root (e.g. tomato → cherry tomato)
  without modelling tags.
- The category enum is intentionally small and stable; an index on `category` keeps filtered fetches and
  shopping-list grouping cheap on D1.
- Spices are excluded from shopping list aggregation (see `../shopping-list/shopping-list.spec.md`)
  because their quantities are typically negligible and unhelpful in a buy-list.
- Read access is unauthenticated so any visitor (including SSR pre-render) can browse recipes and the
  ingredient catalogue; write access is gated, with deletion restricted to admins to protect referential
  integrity in absence of a database FK constraint.
- The form layer relies on TanStack Form's `revalidateLogic()` + `onDynamic` Zod validators so the same
  schema drives both client validation and server input validation.

## 8. Dependencies & External Integrations

- **Runtime.** Cloudflare Workers via TanStack Start.
- **Database.** Cloudflare D1 accessed through Drizzle ORM (`@/lib/db`, `getDb()`).
- **Server functions.** `@tanstack/react-start` (`createServerFn`).
- **Auth.** `@/features/auth/lib/auth-guard` (`authGuard`, `authGuard('admin')`).
- **State.** `@tanstack/react-query` (`queryOptions`, `mutationOptions`, `useMutation`,
  `useSuspenseQuery`).
- **Forms.** `@tanstack/react-form` (`revalidateLogic`, `useStore`), `useAppForm`/`withForm` from
  `@/hooks/use-app-form`, shared `getFormDialog` from `@/components/dialogs/form-dialog`.
- **UI.** `@phosphor-icons/react` (Carrot, Cow, Fish, Package, Pepper, Pencil, Plus), Shadcn-derived
  components (`Badge`, `Button`, `Item*`, `SearchInput`, `ScreenLayout`).
- **Validation.** `zod`.

## 9. Examples & Edge Cases

- **Hierarchy.** Creating "cherry tomato" with `parentId` pointing at "tomato" groups variants under a
  shared parent. The parent reference is informational and does not cascade on delete.
- **Empty preferred unit.** Selecting the `Aucune` option clears `preferredUnitSlug`; the schema accepts
  `null`/`undefined`.
- **Pre-fill from search.** Passing `defaultValue` to `<AddIngredient>` pre-populates the `name` field —
  used by recipe editors when a typed ingredient does not yet exist.
- **Unknown slug at runtime.** `convert()` defensively returns `null` if either slug is missing from
  `UNITS`, even though `unitSlugSchema` should prevent persisted unknown values.
- **Cross-dimension count↔volume.** Bridging count to volume requires both `countWeightG` and
  `densityGPerMl`; if either is missing, `convert()` returns `null`.
- **Length conversions.** `cm` has no bridge to mass/volume/count; cross-dimension conversions involving
  `cm` always return `null`.
- **Category-only search.** Searching `viand` (a substring of `viandes` is not stored) returns empty
  because filtering compares against the English enum value, not the French label; users should search
  by name or by enum slug (`meat`).

## 10. Validation Criteria

- All requirements (REQ-001 to REQ-030) are exercised by automated tests or covered by static schema
  guarantees.
- `vp check` and `vp test` pass after any change to ingredient code paths.
- The `ingredients` table migration matches the columns and index in section 4.1.
- The settings route loads, filters, and gates admin actions per REQ-019 to REQ-023.
- `convert()` round-trips known fixtures (e.g. `convert(1000, 'g', 'kg', _) === 1`).
- Mutation hooks invalidate `queryKeys.listIngredients()` and emit the specified French toasts.

## 11. Related Specifications / Further Reading

- [Application Architecture](../../docs/architecture.spec.md)
- [Data Layer (Drizzle + D1)](../../docs/infrastructure/data-layer.spec.md)
- [Form Patterns](../../docs/infrastructure/forms.spec.md)
- [Recipe Feature](../recipe/spec/index.spec.md)
- [Shopping List Feature](../shopping-list/shopping-list.spec.md)
