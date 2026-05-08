---
title: Data Layer Specification (Drizzle + Cloudflare D1)
version: 1.0
date_created: 2026-05-08
last_updated: 2026-05-08
owner: recipe-organizer
tags: [infrastructure, drizzle, d1, sqlite, schema, migrations]
---

# Data Layer Specification (Drizzle + Cloudflare D1)

## 1. Purpose & Scope

This specification defines the persistence layer for the recipe-organizer app. The app runs on Cloudflare Workers
(stateless, request-scoped) and persists data to Cloudflare D1 (SQLite) through Drizzle ORM. The scope covers schema
declaration, relations, client construction, the data-access patterns used by server functions, migration tooling
(drizzle-kit + Wrangler), and TanStack Query integration.

In scope:

- Drizzle schema modules under `src/lib/db/schema/*` and the relations graph in `src/lib/db/index.ts`.
- The `getDb()` client and the read/write/batch idioms used by feature server functions.
- Migration generation, local apply, and remote apply workflows.
- Conventions for query keys and cache invalidation tied to mutations.

Out of scope:

- Server function transport, validation, and error handling (see `./server-functions.spec.md`).
- Cloudflare Worker bindings, deployment, secrets (see `./platform.spec.md`).
- Feature-specific business rules (see per-feature specs under `src/features/<name>`).

Audience: contributors and AI agents modifying schema, writing queries, or evolving migrations.

## 2. Definitions

- **D1**: Cloudflare's managed SQLite database, exposed to Workers via a `D1Database` binding.
- **Drizzle ORM**: TypeScript ORM/query builder. Used here in its `drizzle-orm/d1` flavor.
- **drizzle-kit**: Companion CLI for schema introspection, migration generation, and remote application.
- **Wrangler**: Cloudflare Workers CLI used for local D1, deploys, and D1 import/export.
- **`getDb()`**: Project helper returning a fresh Drizzle client bound to `cloudflareEnv.DB` for the current request.
- **Relational query API**: `getDb().query.<table>.findMany / findFirst({ columns, with, where, orderBy })` syntax
  driven by the relations object.
- **Batch**: `getDb().batch([...])` — D1's atomic multi-statement transaction primitive.
- **`UnitSlug`**: String-literal union of supported measurement units (see `src/lib/db/schema/unit.ts`).
- **`RecipeTag`**: Domain-specific recipe tag enum defined in `src/features/recipe/utils/constants.ts`.

## 3. Requirements, Constraints & Guidelines

### 3.1 Requirements

- **REQ-001**: All persistent data MUST be stored in the Cloudflare D1 binding named `DB`
  (`wrangler.jsonc` `d1_databases[].binding = "DB"`).
- **REQ-002**: All schema tables MUST be declared with `sqliteTable` from `drizzle-orm/sqlite-core` and live under
  `src/lib/db/schema/`.
- **REQ-003**: Every schema module MUST be re-exported from `src/lib/db/schema/index.ts` so drizzle-kit picks it up
  via `drizzle.config.ts` `schema: './src/lib/db/schema/index.ts'`.
- **REQ-004**: Application code MUST acquire its Drizzle client through `getDb()` from `src/lib/db/index.ts`. Direct
  imports of `drizzle-orm/d1` outside that module are forbidden.
- **REQ-005**: Cross-table reads using `with: { ... }` MUST use relations declared in `defineRelations(...)` in
  `src/lib/db/index.ts`. Adding a new `with` key requires adding the matching relation.
- **REQ-006**: Multi-statement writes that must be atomic MUST be issued via `getDb().batch([...])`.
- **REQ-007**: All foreign keys MUST declare `{ onDelete: 'restrict' }`. Cascading deletes are performed by
  application code (see `src/features/recipe/api/delete.ts`).
- **REQ-008**: Tags on `recipes` MUST be stored as a JSON array using `text({ mode: 'json' }).$type<RecipeTag[]>()`
  with `default([])`.
- **REQ-009**: `unitSlug` columns MUST be typed as `text(...).$type<UnitSlug>()` and validated against
  `unitSlugSchema` (Zod) at server-function boundaries.
- **REQ-010**: Mutations exposed as `mutationOptions` MUST invalidate the relevant query keys from
  `src/lib/query-keys.ts` in their `onSuccess`.
- **REQ-011**: Schema changes MUST be paired with a generated migration committed to `migrations/`.
- **REQ-012**: `vp check` MUST pass before committing any schema or data-layer change.

### 3.2 Constraints

- **CON-001**: Workers are stateless — there is no global connection pool. `getDb()` returns a fresh client per call;
  do not memoize it across requests.
- **CON-002**: D1 is SQLite — only SQLite-compatible types and `dialect: 'sqlite'` migrations are valid.
- **CON-003**: D1 batches are atomic but cannot be nested. Do not call `getDb().batch(...)` from inside another
  batch's statement.
- **CON-004**: `recipes.tags` is a JSON column; equality/`inArray` filters operate on the raw JSON string. Filtering
  by tag membership requires reading and filtering in application code.
- **CON-005**: `ingredient.parentId` is a self-referencing FK declared without an explicit `references(...)` so the
  schema can compile in a single module; the relation is wired via `defineRelations` instead. Preserve this pattern
  when extending self-references.
- **CON-006**: `wrangler.jsonc` `d1_databases[].migrations_dir` is set to `migrations_tmp` for Wrangler's own
  migration mechanism. The authoritative migration directory for drizzle-kit is `migrations/` (per
  `drizzle.config.ts`). Do not conflate the two.
- **CON-007**: Local migration apply uses a project-specific Bun script invoked via
  `pnpm migration:apply:local`. Remote apply runs `drizzle-kit migrate` in CI (`pnpm migration:apply:remote`).
- **CON-008**: drizzle-kit credentials come from `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, and
  `CLOUDFLARE_D1_TOKEN` env vars. They MUST NOT be committed.

### 3.3 Guidelines

- **GUD-001**: Prefer the relational query API (`getDb().query.<table>.findFirst/findMany`) for reads — it returns
  typed nested results matching the relations graph.
- **GUD-002**: Use `getDb().select(...).from(...).where(...)` only when a narrow projection is needed (e.g. fetching
  `category` only) or when relational API does not express the query.
- **GUD-003**: When deleting an entity with children, list the deletes child-first inside `getDb().batch([...])` so
  the parent delete succeeds despite ON DELETE RESTRICT.
- **GUD-004**: Index any column used as an FK or as a frequent `where` filter. Existing indexes are listed in the
  data dictionary below; mirror that pattern for new tables.
- **GUD-005**: Co-locate query and mutation `*Options` factories with the feature in `src/features/<name>/api/`,
  and tag them with keys from `src/lib/query-keys.ts`.
- **GUD-006**: Eagerly preload list and detail queries in TanStack Router loaders via
  `context.queryClient.ensureQueryData(<*Options>)` to avoid client-side fetch waterfalls.

## 4. Interfaces & Data Contracts

### 4.1 Drizzle Client

```ts
// src/lib/db/index.ts
export const getDb = () => drizzle(cloudflareEnv.DB, { relations })
```

- Input: `cloudflareEnv.DB` (D1 binding from `cloudflare:workers`).
- Output: a Drizzle client typed against the relations graph, exposing `.query`, `.select`, `.insert`, `.update`,
  `.delete`, and `.batch`.
- Lifetime: per-call. Always invoke `getDb()` at the use site.

### 4.2 Relations Graph

Defined via `defineRelations(...)` in `src/lib/db/index.ts`:

| Owner table             | Relation key       | Cardinality | Target table            | Notes                                                     |
| ----------------------- | ------------------ | ----------- | ----------------------- | --------------------------------------------------------- |
| `groupIngredient`       | `group`            | one         | `recipeIngredientGroup` | FK `groupId` → `recipeIngredientGroup.id`.                |
| `groupIngredient`       | `ingredient`       | one (req.)  | `ingredient`            | FK `ingredientId` → `ingredient.id`. `optional: false`.   |
| `ingredient`            | `groupIngredients` | many        | `groupIngredient`       | Reverse of `groupIngredient.ingredient`.                  |
| `ingredient`            | `parent`           | one         | `ingredient`            | Self-FK via `parentId`.                                   |
| `recipe`                | `creator`          | one         | `user`                  | FK `createdBy` → `user.id`.                               |
| `recipe`                | `ingredientGroups` | many        | `recipeIngredientGroup` | Reverse of `recipeIngredientGroup.recipe`.                |
| `recipe`                | `linkedRecipes`    | many        | `recipeLinkedRecipes`   | From `recipe.id` to `recipeLinkedRecipes.recipeId`.       |
| `recipe`                | `linkedTo`         | many        | `recipeLinkedRecipes`   | From `recipe.id` to `recipeLinkedRecipes.linkedRecipeId`. |
| `recipeIngredientGroup` | `recipe`           | one         | `recipe`                | FK `recipeId` → `recipe.id`.                              |
| `recipeIngredientGroup` | `groupIngredients` | many        | `groupIngredient`       | Reverse of `groupIngredient.group`.                       |
| `recipeLinkedRecipes`   | `recipe`           | one (req.)  | `recipe`                | FK `recipeId` → `recipe.id`.                              |
| `recipeLinkedRecipes`   | `linkedRecipe`     | one (req.)  | `recipe`                | FK `linkedRecipeId` → `recipe.id`.                        |
| `user`                  | `recipes`          | many        | `recipe`                | Reverse of `recipe.creator`.                              |

### 4.3 Read Pattern

```ts
const recipeRow = await getDb().query.recipe.findFirst({
  where: { id },
  with: {
    ingredientGroups: { orderBy: { isDefault: 'desc' }, ...ingredientGroupSelect },
    linkedRecipes: { with: { linkedRecipe: { columns: { id: true, name: true } } } },
  },
})
```

### 4.4 Write Pattern

```ts
const [created] = await getDb()
  .insert(recipe)
  .values({
    /* ... */
  })
  .returning({ id: recipe.id })
```

### 4.5 Atomic Multi-Statement Pattern

```ts
await getDb().batch([
  getDb().delete(groupIngredient).where(inArray(groupIngredient.groupId, groupIds)),
  getDb().delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
  getDb().delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
  getDb().delete(recipe).where(eq(recipe.id, id)),
])
```

### 4.6 Query Keys

```ts
// src/lib/query-keys.ts
export const queryKeys = {
  allIngredients: ['ingredients'] as const,
  allRecipes: ['recipes'] as const,
  allUsers: ['users'] as const,
  detailIngredient: (id: string) => [...queryKeys.allIngredients, id] as const,
  listIngredients: () => [...queryKeys.allIngredients, 'list'] as const,
  listUsers: (status?: string) => [...queryKeys.allUsers, 'list', status ?? 'active'] as const,
  recipeDetail: (id: number) => [...queryKeys.allRecipes, 'detail', id] as const,
  recipeInstructions: (id: number) => [...queryKeys.allRecipes, 'instructions', id] as const,
  recipeList: () => [...queryKeys.recipeLists(), 'all'] as const,
  recipeListByIds: (ids: number[]) => [...queryKeys.recipeLists(), ids] as const,
  recipeLists: () => [...queryKeys.allRecipes, 'list'] as const,
}
```

## 5. Acceptance Criteria

- **AC-001**: Given a new schema module, when re-exported from `src/lib/db/schema/index.ts`, then
  `vp dlx drizzle-kit generate` produces a migration in `migrations/` with no manual edits to existing files.
- **AC-002**: Given a `with: { <relationKey>: ... }` clause used by application code, when the relations graph in
  `src/lib/db/index.ts` is inspected, then `<relationKey>` is declared on the owning table in `defineRelations(...)`.
- **AC-003**: Given a delete of a parent entity, when the operation runs, then all child rows are removed in the
  same `getDb().batch([...])` call before the parent row is deleted.
- **AC-004**: Given a successful mutation (`create`/`update`/`delete`), when the `onSuccess` handler runs, then it
  invalidates `queryKeys.recipeLists()`/`queryKeys.allRecipes` (or the equivalent for the affected feature).
- **AC-005**: Given a route that depends on a list or detail query, when the loader runs, then the data is
  pre-fetched via `context.queryClient.ensureQueryData(<*Options>)`.
- **AC-006**: Given any change under `src/lib/db/`, when CI runs `vp check` and `vp test`, then both succeed before
  merge.
- **AC-007**: Given a deployed environment, when `pnpm migration:apply:remote` is invoked in CI, then
  `drizzle-kit migrate` applies pending `migrations/*.sql` files against the configured D1 database.

## 6. Test Automation Strategy

- **Unit tests** (Vitest, via `vp test`): cover unit-conversion math, query-key helpers, and any pure helpers used by
  data access (e.g. `unit-converter.ts`, `query-keys.ts`).
- **Integration tests**: server-function level tests that exercise `getDb()` against a local D1 (via Wrangler) or a
  drizzle-compatible test harness. Validate that mutations leave the DB in the expected state and that batched
  deletes obey FK ordering.
- **Type tests**: rely on TS to catch divergence between `defineRelations(...)` keys and `with: { ... }` usage.
  `vp check` runs the type-aware lint pass.
- **Manual verification**: after migration changes, run `pnpm migration:apply:local` and exercise the affected
  flows in `pnpm dev` before pushing.

## 7. Rationale & Context

- **PAT-001 (per-call client)**: Workers are short-lived; reusing a Drizzle client across requests can leak state
  between isolates. `getDb()` is intentionally lightweight so it's safe to call in every server function.
- **PAT-002 (ON DELETE RESTRICT + app-level cascade)**: D1 supports SQLite FK actions, but explicit application
  cascades make data-loss paths reviewable in code (see `recipe/api/delete.ts`) and avoid surprising removals when
  a user re-uses an entity (e.g. an `ingredient` referenced by multiple recipes).
- **PAT-003 (relations object decoupled from columns)**: Self-references and many-to-many bridges (like
  `recipe_linked_recipes`) are easier to express via `defineRelations` than via `references(...)` callbacks at
  column declaration time, and avoid circular imports.
- **PAT-004 (JSON tags column)**: Storing tags as JSON keeps the schema simple for a small enum set. The trade-off
  (no SQL-side membership filtering) is acceptable because the tag list is small and almost always read with the
  recipe row.
- **PAT-005 (auto-tag computation at write time)**: `vegetarian`/`magimix` flags are derived during create/update
  (`src/features/recipe/api/create.ts`, `update.ts`) so reads remain a single row fetch.
- **PAT-006 (two migration tools)**: drizzle-kit owns the source-of-truth migrations under `migrations/`. The
  `migrations_tmp` referenced in `wrangler.jsonc` belongs to Wrangler's separate (and currently unused) migration
  mechanism — kept distinct to avoid Wrangler stomping on drizzle-managed history.

## 8. Dependencies & External Integrations

### 8.1 Runtime Dependencies

- **DEP-001**: `drizzle-orm` — query builder and relational query API (`drizzle-orm`, `drizzle-orm/d1`,
  `drizzle-orm/sqlite-core`).
- **DEP-002**: `cloudflare:workers` — provides the runtime `env` with the `DB` binding.
- **DEP-003**: `@tanstack/react-query` — `mutationOptions`/`queryOptions` and cache invalidation.
- **DEP-004**: `@tanstack/react-router` — loader-driven preloading via `context.queryClient.ensureQueryData(...)`.
- **DEP-005**: `zod` — input validation at server-function boundaries (e.g. `unitSlugSchema`, `recipeSchema`).

### 8.2 Tooling Dependencies

- **DEP-006**: `drizzle-kit` (invoked through `vp dlx`) — schema diff, migration generation, and remote apply.
- **DEP-007**: `wrangler` — local D1 (`wrangler d1 execute`), import/export (`wrangler d1 export ... --no-schema`),
  and deployment.
- **DEP-008**: Custom Bun script behind `pnpm migration:apply:local`.

### 8.3 External Services

- **SVC-001**: Cloudflare D1 (database `recipe-organizer`, id `542863e2-5f6d-4ef7-9fd0-84b673f76f43` per
  `wrangler.jsonc`).
- **SVC-002**: Cloudflare API (drizzle-kit `driver: 'd1-http'` for remote schema operations; requires
  `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID`, `CLOUDFLARE_D1_TOKEN`).

## 9. Examples & Edge Cases

### 9.1 Selecting a recipe with nested relations

```ts
await getDb().query.recipe.findFirst({
  where: { id },
  with: {
    ingredientGroups: { orderBy: { isDefault: 'desc' }, ...ingredientGroupSelect },
    linkedRecipes: {
      with: {
        linkedRecipe: {
          columns: { id: true, name: true },
          with: { ingredientGroups: { ...ingredientGroupSelect, where: { isDefault: true } } },
        },
      },
    },
  },
})
```

### 9.2 Atomic recipe delete (child-first)

```ts
await getDb().batch([
  getDb().delete(groupIngredient).where(inArray(groupIngredient.groupId, groupIds)),
  getDb().delete(recipeIngredientGroup).where(eq(recipeIngredientGroup.recipeId, id)),
  getDb().delete(recipeLinkedRecipes).where(eq(recipeLinkedRecipes.recipeId, id)),
  getDb().delete(recipe).where(eq(recipe.id, id)),
])
```

### 9.3 Edge case — JSON tag filtering

`tags` is a JSON column. To check tag membership, fetch the rows and filter in JS (see `create.ts` reading
`{ tags: recipe.tags }` and calling `tags?.includes('vegetarian')`). Do not attempt SQL `LIKE`-based JSON probing.

### 9.4 Edge case — adding a new `with` key

If a feature needs `recipe.creator.recipes`, ensure both `recipe.creator` and `user.recipes` are declared in
`defineRelations(...)`. Otherwise the relational query type narrows away the field and runtime returns `undefined`.

### 9.5 Edge case — batch ordering

A `batch` is atomic but statements still run in declaration order. Always sequence deletes from leaves to root to
satisfy ON DELETE RESTRICT.

### 9.6 Edge case — DB dump/restore

```bash
wrangler d1 export recipe-organizer --output ./database.sql --no-schema
wrangler d1 execute recipe-organizer --file ./database.sql
```

The `--no-schema` flag exports data only; the receiving database must already have the schema applied via
`drizzle-kit migrate`.

## 10. Validation Criteria

- **VAL-001**: `vp check` passes (format + lint + type-aware lint).
- **VAL-002**: `vp test` passes.
- **VAL-003**: `vp dlx drizzle-kit generate` produces an empty diff after a clean checkout (no drift between
  schema files and `migrations/`).
- **VAL-004**: Every `with: { ... }` key used in `src/features/**/api/*.ts` corresponds to a key declared in
  `defineRelations(...)` in `src/lib/db/index.ts`.
- **VAL-005**: Every mutation in `src/features/**/api/{create,update,delete}.ts` invalidates an appropriate key
  from `src/lib/query-keys.ts` in `onSuccess`.
- **VAL-006**: Every FK in `src/lib/db/schema/*.ts` declares `{ onDelete: 'restrict' }`.
- **VAL-007**: After running `pnpm migration:apply:local`, the local D1 schema matches the schema in
  `src/lib/db/schema/`.

## 11. Data Dictionary

The following tables describe each schema. Columns marked `Null` mean the column is nullable. `FK` lists foreign-key
target tables. All FKs use `ON DELETE RESTRICT`. Primary keys are noted in the `Default` column.

### 11.1 `recipes` (`recipe.ts`)

| Column         | Type                                   | Null | Default     | Index | FK / Notes                          |
| -------------- | -------------------------------------- | ---- | ----------- | ----- | ----------------------------------- |
| `id`           | `integer`                              | No   | PRIMARY KEY | PK    |                                     |
| `name`         | `text(255)`                            | No   |             |       |                                     |
| `image`        | `text(255)`                            | No   |             |       | R2 object key.                      |
| `instructions` | `text`                                 | No   |             |       | Rich-text JSON payload (TipTap).    |
| `servings`     | `integer`                              | No   |             |       |                                     |
| `tags`         | `text` (`mode: 'json'`, `RecipeTag[]`) | No   | `[]`        |       | JSON array of `RecipeTag`.          |
| `video`        | `text(255)`                            | Yes  |             |       | Optional R2 object key.             |
| `created_by`   | `text`                                 | No   | `'1'`       |       | FK → `user.id` via relations graph. |

- **DAT-001**: `recipes.tags` is JSON; never SQL-filter on it.
- **DAT-002**: `recipes.created_by` defaults to `'1'` for legacy seed compatibility; mutations set the actual
  authenticated user id (`context.user.id`).

### 11.2 `recipe_ingredient_groups` (`recipe-ingredients.ts`)

| Column       | Type                          | Null | Default     | Index                                     | FK / Notes                           |
| ------------ | ----------------------------- | ---- | ----------- | ----------------------------------------- | ------------------------------------ |
| `id`         | `integer`                     | No   | PRIMARY KEY | PK                                        |                                      |
| `group_name` | `text(255)`                   | Yes  |             |                                           | Display name; null on default group. |
| `is_default` | `integer` (`mode: 'boolean'`) | No   | `false`     | `idx_recipe_ingredient_groups_is_default` |                                      |
| `recipe_id`  | `integer`                     | No   |             | `idx_recipe_ingredient_groups_recipe_id`  | FK → `recipes.id` (RESTRICT).        |

- **DAT-003**: Each recipe MUST have exactly one group with `is_default = true` — enforced by application code
  (`index === 0` in `create.ts`/`update.ts`).

### 11.3 `group_ingredients` (`recipe-ingredients.ts`)

| Column          | Type                | Null | Default     | Index                                 | FK / Notes                                         |
| --------------- | ------------------- | ---- | ----------- | ------------------------------------- | -------------------------------------------------- |
| `id`            | `integer`           | No   | PRIMARY KEY | PK                                    |                                                    |
| `group_id`      | `integer`           | No   |             | `idx_group_ingredients_group_id`      | FK → `recipe_ingredient_groups.id` (RESTRICT).     |
| `ingredient_id` | `integer`           | No   |             | `idx_group_ingredients_ingredient_id` | FK → `ingredients.id` (RESTRICT).                  |
| `quantity`      | `real`              | No   |             |                                       | Quantity in `unit_slug`.                           |
| `unit_slug`     | `text` (`UnitSlug`) | Yes  |             |                                       | Validated via `unitSlugSchema` at server boundary. |

### 11.4 `recipe_linked_recipes` (`recipe-linked-recipes.ts`)

| Column             | Type      | Null | Default | Index                                        | FK / Notes                                   |
| ------------------ | --------- | ---- | ------- | -------------------------------------------- | -------------------------------------------- |
| `recipe_id`        | `integer` | No   |         | `idx_recipe_linked_recipes_recipe_id`        | FK → `recipes.id` (RESTRICT).                |
| `linked_recipe_id` | `integer` | No   |         | `idx_recipe_linked_recipes_linked_recipe_id` | FK → `recipes.id` (RESTRICT).                |
| `ratio`            | `real`    | No   | `1`     |                                              | Scaling factor applied to the linked recipe. |

- **DAT-004**: This table has no synthetic primary key. Uniqueness of the `(recipe_id, linked_recipe_id)` pair is
  not currently enforced at the schema level — application code MUST avoid inserting duplicates.

### 11.5 `ingredients` (`ingredient.ts`)

| Column                | Type                                | Null | Default     | Index                      | FK / Notes                                                      |
| --------------------- | ----------------------------------- | ---- | ----------- | -------------------------- | --------------------------------------------------------------- |
| `id`                  | `integer`                           | No   | PRIMARY KEY | PK                         |                                                                 |
| `name`                | `text`                              | No   |             |                            |                                                                 |
| `category`            | `text` (`enum: ingredientCategory`) | No   | `'other'`   | `idx_ingredients_category` | One of `meat`, `fish`, `vegetables`, `spices`, `other`.         |
| `parent_id`           | `integer`                           | Yes  |             |                            | Self-FK wired through `defineRelations` (no inline references). |
| `density_g_per_ml`    | `real`                              | Yes  |             |                            | Used by unit conversion (volume ↔ mass).                        |
| `count_weight_g`      | `real`                              | Yes  |             |                            | Used by unit conversion (count ↔ mass).                         |
| `preferred_unit_slug` | `text` (`UnitSlug`)                 | Yes  |             |                            | UI default; not persisted on group ingredients.                 |

- **DAT-005**: `ingredientCategory = ['meat', 'fish', 'vegetables', 'spices', 'other'] as const` is exported from
  `ingredient.ts`. Adding a category requires a migration AND an update to `computeAutoTags` in `recipe/api/update.ts`.

### 11.6 `user` (`user.ts`)

| Column   | Type                                              | Null | Default     | Index  | FK / Notes                                |
| -------- | ------------------------------------------------- | ---- | ----------- | ------ | ----------------------------------------- |
| `id`     | `text`                                            | No   | PRIMARY KEY | PK     | String id (matches auth provider format). |
| `email`  | `text`                                            | No   |             | UNIQUE | Unique constraint enforced at SQL level.  |
| `role`   | `text` (`enum: ['user', 'admin']`)                | No   | `'user'`    |        |                                           |
| `status` | `text` (`enum: ['pending', 'active', 'blocked']`) | No   | `'active'`  |        |                                           |

### 11.7 Units (`unit.ts`, in-code only)

`UNITS` is a static `Record<UnitSlug, Unit>` (no DB table). Each unit declares:

- `slug`: `UnitSlug` literal.
- `name`: human-readable label.
- `dimension`: `'mass' | 'volume' | 'count' | 'length'`.
- `parent`: parent unit slug (e.g. `kg.parent = 'g'`) or `null`.
- `factor`: scalar to convert into parent (e.g. `kg.factor = 1000`).

Conversions bridge across dimensions through grams using `ingredient.densityGPerMl` (volume ↔ mass) and
`ingredient.countWeightG` (count ↔ mass). See `unit-converter.ts` for the algorithm.

- **DAT-006**: Adding a new `UnitSlug` requires updating: the `UnitSlug` union in `unit.ts`, the `UNITS` map,
  `unitSlugSchema`, and any downstream forms. No migration is needed (units are not persisted as a table).

## Cross-References

- [Platform (Cloudflare Workers)](./platform.spec.md)
- [Server Functions](./server-functions.spec.md)
- [Architecture overview](../architecture.spec.md)
- [Recipe feature spec](../../src/features/recipe/spec/index.spec.md)
- [Ingredients feature spec](../../src/features/ingredients/ingredients.spec.md)
