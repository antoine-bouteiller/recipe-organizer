---
title: Data layer (Drizzle + D1)
status: condensed
author: Antoine Bouteiller
date: 2026-04-16
related:
  - ./platform.spec.md
  - ./server-functions.spec.md
  - ../../src/features/recipe/spec/index.spec.md
---

## 2. Problem Statement

Every feature reads and writes through the same data layer: Drizzle ORM over a Cloudflare D1 SQLite database,
with JSON columns for tag-like arrays and text columns for opaque structured payloads (Lexical JSON). We need
consistent conventions so:

- `[G-1]` Schema lives in one place (`src/lib/db/schema/`) and is imported symbolically, not referenced by raw
  table name.
- `[G-2]` Relations are declared once in a central `defineRelations(...)` block and reused via the query
  builder's `with: { ... }` options.
- `[G-3]` Cascading behavior is explicit in the schema (`onDelete: 'restrict' | 'set null'`) and matches the
  cascade rules enforced by higher-level code.
- `[G-4]` Migrations are SQL-first (`drizzle-kit`), checked in, and applied locally + remotely via scripts
  under `scripts/`.
- `[G-5]` Multi-statement writes use `getDb().batch([...])` to hit D1 in a single request and maintain
  atomicity.
- `[G-6]` Query keys for TanStack Query are centralized and hierarchically structured, so invalidation scopes
  are easy to reason about.

## 3. Key Design Decisions

| Decision                               | Choice                                                                                                                                                      | Rationale                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Drizzle ORM + D1              | `drizzle-orm/d1` via `getDb()`                                                                                                                              | Type-safe SQL on Workers; zero runtime overhead beyond prepared statements.                                      |
| `[KD-2]` Schema as TypeScript          | One file per table under `src/lib/db/schema/`, re-exported from `src/lib/db/schema/index.ts`                                                                | Collocated with TS types; migrations generated from the schema.                                                  |
| `[KD-3]` Central `defineRelations`     | `src/lib/db/index.ts` declares all relations in a single block                                                                                              | Query builder `with: {...}` requires a relation graph; having one source avoids relation drift.                  |
| `[KD-4]` Explicit cascade per FK       | `onDelete: 'restrict'` for most, `'set null'` for optional units                                                                                            | Forces callers to pre-clean dependent rows; surfaces "still in use" errors cleanly.                              |
| `[KD-5]` JSON columns for typed arrays | `text('tags', { mode: 'json' }).$type<RecipeTag[]>()`                                                                                                       | SQLite has no array type; JSON mode gives serialization without a join table.                                    |
| `[KD-6]` Drizzle `batch` for writes    | Any write touching >1 table wraps its statements in `getDb().batch([...])`                                                                                  | Reduces round-trips to D1 and provides atomicity within the batch.                                               |
| `[KD-7]` Centralized query keys        | `src/lib/query-keys.ts` exports a `queryKeys` object with hierarchical key factories                                                                        | Single source of truth for cache bucketing; invalidate at the right granularity.                                 |
| `[KD-8]` `withServerError` wrapper     | `src/utils/error-handler.ts` wraps all read handlers that need error normalization                                                                          | Translates ZodErrors into `Invalid Schema; ...` errors; non-redirect/notFound errors become generic French copy. |
| `[KD-9]` Reuse-ingredient-group helper | `src/features/shopping-list/utils/ingredient-group-select.ts` and `src/features/recipe/utils/ingredient-group-select.ts` expose standardized `with` clauses | The nested read is used by multiple features; duplication would drift.                                           |

## 4. Principles & Intents

- `[PI-1]` **Schema = source of truth** — never write raw SQL outside migrations. Use the Drizzle query builder
  everywhere.
- `[PI-2]` **One relations block** — any new relation goes into the single `defineRelations(...)` call so the
  graph stays consistent.
- `[PI-3]` **Explicit cascades** — never rely on SQLite defaults. Every FK declares `onDelete`.
- `[PI-4]` **Batch multi-statement writes** — a mutation that deletes relations and re-inserts them uses
  `batch([...])`, not sequential awaits.
- `[PI-5]` **Centralize query keys** — never inline `['recipes', 'detail', id]` in a component. Import the
  factory.
- `[PI-6]` **Invalidate the smallest correct bucket** — `createRecipe` invalidates `recipeLists()`;
  `updateRecipe` invalidates `allRecipes` (includes detail + instructions + by-ids).

## 5. Non-Goals

- `[NG-1]` Raw SQL migrations outside of the `drizzle-kit` generated files.
- `[NG-2]` Read-replica routing / DB failover.
- `[NG-3]` Database seeding in production (dev-only via scripts).
- `[NG-4]` Schema versioning at the application level (beyond `drizzle-kit` journal).
- `[NG-5]` Soft-delete / tombstone tables. Deletes are hard.

## 6. Caveats

- `[C-1]` `ingredient.parent_id` and `unit.parent_id` are declared as plain `integer` columns — NO Drizzle FK.
  Orphaned parent references are permitted. See ingredients spec `[C-1]`, units spec `[C-1]`.
- `[C-2]` `recipe.createdBy` is `text` with default `'1'` and no FK to `user.id`. Legacy rows reference
  non-existent users.
- `[C-3]` `recipe.tags` is stored as JSON but nothing at the DB level enforces the enum. A bad write can
  persist an unknown tag.
- `[C-4]` D1 has a ~1 MB request size limit. Large instruction JSON or many ingredients on a single write can
  theoretically bump this. No guard in place today.
- `[C-5]` `migrations_tmp/` is the Wrangler-configured directory; canonical migrations live in `migrations/`.
  See platform `[C-1]`.
- `[C-6]` `getDb()` is called per-request (not cached across invocations). D1 connections are pooled by the
  platform; this is fine.

## 7. High-Level Components

| Component          | Module type      | Responsibility                                                        | Public API surface                                                                                                    |
| ------------------ | ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Schema (per table) | Drizzle tables   | Column types, defaults, indexes, FK cascades                          | `src/lib/db/schema/*.ts` (re-exported from `index.ts`)                                                                |
| Relations          | Drizzle relation | Single `defineRelations(...)` graph used by the query builder         | `src/lib/db/index.ts`                                                                                                 |
| DB accessor        | Server helper    | `getDb()` returns a Drizzle instance bound to the `DB` Worker binding | `src/lib/db/index.ts` → `getDb`                                                                                       |
| Migrations         | SQL files        | Versioned schema evolution                                            | `migrations/*.sql` (`drizzle.config.ts` controls generation)                                                          |
| Migration tooling  | Scripts          | `scripts/apply-migration-local.ts` + wrangler for remote              | `scripts/*.ts`                                                                                                        |
| Query keys         | Factory object   | Centralized TanStack Query keys                                       | `src/lib/query-keys.ts` → `queryKeys`                                                                                 |
| Read helpers       | Query fragments  | Reusable `with: {...}` shapes (ingredient group selects)              | `src/features/recipe/utils/ingredient-group-select.ts`, `src/features/shopping-list/utils/ingredient-group-select.ts` |
| Error wrapper      | Util             | `withServerError` — translates Zod / unknown errors to stable shape   | `src/utils/error-handler.ts`                                                                                          |

## 8. Detailed Design

| Concern                  | Entry point                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| Per-table schema         | `src/lib/db/schema/` (user, recipe, ingredient, unit, recipe-ingredients, recipe-linked-recipes) |
| Relations graph          | `src/lib/db/index.ts` → `defineRelations(...)`                                                   |
| DB accessor              | `src/lib/db/index.ts` → `getDb`                                                                  |
| Migration config         | `drizzle.config.ts`                                                                              |
| Migration files          | `migrations/*.sql`                                                                               |
| Local apply script       | `scripts/apply-migration-local.ts`                                                               |
| Lexical migration script | `scripts/migrate-instructions-to-lexical.ts`                                                     |
| Query keys               | `src/lib/query-keys.ts`                                                                          |
| Error wrapper            | `src/utils/error-handler.ts`                                                                     |
| DB SQL dump              | `database.sql` (checked-in snapshot; reference only)                                             |

Query-key structure (see `src/lib/query-keys.ts`):

```text
all<Entity>          ['recipes']
  list<Entity>       ['recipes', 'list']
    recipeList()     ['recipes', 'list', 'all']
    recipeListByIds  ['recipes', 'list', [id, id, ...]]
  recipeDetail(id)   ['recipes', 'detail', id]
  recipeInstructions ['recipes', 'instructions', id]
```

Invalidate with the most specific key that covers the affected data — prefer `recipeLists()` over
`allRecipes` when a detail page did not change.

## 9. Verification Criteria

- `[VC-1]` Every table under `src/lib/db/schema/` is re-exported from `src/lib/db/schema/index.ts` and
  referenced by `defineRelations` in `src/lib/db/index.ts`.
- `[VC-2]` Any FK declared with `.references(...)` has an explicit `onDelete` option.
- `[VC-3]` Multi-statement write handlers call `getDb().batch([...])` rather than sequential `await`s. (Spot
  check: `src/features/recipe/api/update.ts`, `delete.ts`.)
- `[VC-4]` No feature inlines raw query-key arrays; all lookups go through `queryKeys.*`.
- `[VC-5]` `withServerError` is applied to read handlers that depend on the client receiving a clean error
  message (list, detail, instructions, delete, update).
- `[VC-6]` `drizzle-kit generate` produces a migration file in `migrations/` when the schema changes;
  `scripts/apply-migration-local.ts` applies it to the local D1 replica.
- `[VC-7]` `pnpm typecheck` passes — Drizzle types flow through relations into `findFirst` / `findMany`
  with full autocompletion.

## 10. Open Questions

- `[OQ-1]` Should `recipe.createdBy` gain an FK to `user.id` with `onDelete: 'set null'`? Blocked by legacy
  `'1'` defaults.
- `[OQ-2]` Is it worth replacing `text('tags', { mode: 'json' })` with a proper join table for future filter
  performance?
- `[OQ-3]` Consolidate `migrations/` and `migrations_tmp/` into one directory.
