# 02 — Data Layer (Drizzle + D1 → `void/db`)

The data model itself doesn't change. Only the import surface, the
import-from-CF-env wiring, and the migration tooling change.

## Source-of-truth move

**Today:**

```
src/lib/db/index.ts        ← drizzle instance + relations
src/lib/db/schema/*.ts     ← tables
migrations/<timestamp>_<name>/*.sql
drizzle.config.ts          ← drizzle-kit config pointing at d1-http
```

**Target:**

```
db/schema.ts               ← barrel re-export (replaces src/lib/db/schema/index.ts)
db/schema/*.ts             ← tables (moved verbatim from src/lib/db/schema/)
db/migrations/<timestamp>_<name>.sql  ← flattened: one .sql per migration, not a directory per
```

Notes:

- Void's convention is **a single `.sql` per migration**, named
  `<timestamp>_<name>.sql`, not a directory.
- `db/schema.ts` must export every table so that `import { … } from '@schema'`
  works (Vite path alias auto-configured by `voidPlugin()`).
- `src/lib/db/index.ts` (the `getDb()` factory + `defineRelations`) is
  **removed**. `db` from `void/db` is the pre-wired Drizzle instance and
  Void's Vite plugin auto-injects the relations defined alongside tables.

## Schema column-helper imports

Tables currently import from `drizzle-orm/sqlite-core`. Migrate to
`void/schema-d1`:

```ts
// BEFORE — src/lib/db/schema/recipe.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// AFTER — db/schema/recipe.ts
import { integer, sqliteTable, text } from 'void/schema-d1'
import { sql } from 'void/db'
```

`sql`, `eq`, `and`, `or`, `inArray`, `desc`, etc. — everything that was
previously imported from `drizzle-orm` — comes from `void/db`. See
[Imports cleanup](#imports-cleanup) for the full list of touch sites.

## Relations migration

Today's `defineRelations(...)` call in `src/lib/db/index.ts` declares relations
between `groupIngredient`, `ingredient`, `ingredientCategory`, `recipe`,
`recipeIngredientGroup`, `recipeLinkedRecipes`, and `user`.

Void supports Drizzle's relational query API (per
`node_modules/void/skills/void/docs/guide/database.md`). The relations file
moves to `db/schema.ts` (or `db/relations.ts` co-located and re-exported
from the barrel). Keep the relation shape identical.

**Reference for relations on D1 + void:**

- The `db` instance imported from `void/db` already has the schema
  injected by the Vite plugin, so `db.query.recipe.findFirst({ where: { … } })`
  still works.
- Confirm at implementation that auto-injection covers `db.query.*`. If
  not — escalate, as it would force a partial rewrite away from relational
  queries (used in `src/features/auth/api/google-auth.ts`, recipe
  `get-one.ts`, and `get-recipe-by-ids.ts`).

## `getDb()` removal

Every `getDb()` call site changes:

```ts
// BEFORE
import { getDb } from '@/lib/db'
const rows = await getDb().select().from(recipe)

// AFTER
import { db } from 'void/db'
const rows = await db.select().from(recipe)
```

Touch sites (non-exhaustive — verify with grep):

- `src/features/recipe/api/{create,update,delete,get-all,get-one,get-instructions}.ts`
- `src/features/ingredients/api/get-recipe-by-ids.ts`
- `src/features/users/api/{approve,block,create,get-all}.ts`
- `src/features/auth/api/{google-auth,get-auth-user,logout}.ts`

These files are also being **relocated** to Pages-mode loaders/actions or
Void `routes/` (see [05-routing-and-pages](./05-routing-and-pages.spec.md));
the `getDb()` rewrite happens as part of that relocation.

## Migrations directory

Migration file shape changes from directory-per-migration to file-per-migration.

**Action:**

1. Run `void db generate` against the migrated schema. This emits a fresh
   `db/migrations/<timestamp>_<name>.sql` representing the **current state**
   of the schema.
2. Diff the generated SQL against the union of all existing
   `migrations/*/migration.sql` files to confirm equivalence.
3. **For local dev:** acceptable to drop and re-run from scratch (`void db reset`).
4. **For production data:** see [03b — migrating existing remote D1](#migrating-the-deployed-d1).

### Migrating the deployed D1

Two acceptable paths, decided at implementation time:

- **Path A — "Continue lineage":** Manually copy each `migrations/<dir>/migration.sql`
  to `db/migrations/<same-timestamp>_<name>.sql` (flattening the per-dir
  shape) plus the `__drizzle_migrations` tracking table that drizzle-kit
  uses. Then run `void db rename-migrations` (per
  `node_modules/void/skills/void/docs/reference/cli.md`) to convert any
  numeric-prefix legacy entries. Risk: the drizzle-kit tracking table
  shape may not align with what Void's migrator expects — verify before
  prod.
- **Path B — "Baseline reset":** Generate one consolidated initial
  migration from current schema, mark it as already applied on production
  D1 via direct `wrangler d1 execute` insert into `__drizzle_migrations`,
  then continue with normal `void db migrate --remote`. Lower fidelity but
  simpler. Acceptable because the migration files are not used for
  rollback in this project.

**Recommendation: Path B** unless we discover that Void's migrator strictly
requires the original timestamp lineage. The recipe data is the source of
truth — migration history is metadata.

## Path alias and import-from-`@schema`

Void auto-configures `@schema` to point at `db/schema.ts`. Use it everywhere
table identifiers are imported:

```ts
import { recipe, user, ingredient } from '@schema'
```

This replaces `@/lib/db/schema` imports across the codebase.

The existing `@/` alias from `tsconfig-paths` (currently mapping to `./src`)
stays untouched — feature code under `src/features/**` keeps using `@/…`
imports for non-schema things.

## Schema-derived validators

Today's `create.ts` / `update.ts` for recipe define a full `recipeSchema`
manually. Where shapes align with the DB, switch to `void/drizzle-zod`:

```ts
// db/schema/recipe.ts (excerpt)
import { createInsertSchema, createUpdateSchema } from 'void/drizzle-zod'

export const insertRecipeSchema = createInsertSchema(recipe, {
  name: (s) => s.min(2),
  servings: (s) => s.min(0),
})
export const updateRecipeSchema = createUpdateSchema(recipe)
```

Then in the action handler:

```ts
// pages/recipe/new.server.ts
import { defineHandler } from 'void'
import { db } from 'void/db'
import { recipe, insertRecipeSchema } from '@schema'

export const action = defineHandler.withValidator({
  body: insertRecipeSchema.extend({
    image: z.union([z.instanceof(File), z.object({ id: z.string(), url: z.string() })]),
    ingredientGroups: z.array(/* … */),
    /* … */
  }),
})(async (c, { body }) => {
  /* … */
})
```

The complex non-DB parts (`image`, `ingredientGroups`, `linkedRecipes`) stay
as bespoke Zod. The derived part keeps `name`, `servings`, `instructions`,
`tags` in sync with the table. The current `recipeSchema` is migrated by
extending the derived insert schema with the complex extras rather than
re-declaring DB fields.

## Imports cleanup

Search for and rewrite (case-sensitive):

| Old import path                   | New import path         | Notes                                       |
| --------------------------------- | ----------------------- | ------------------------------------------- |
| `'drizzle-orm'`                   | `'void/db'`             | All operators (`eq`, `and`, `inArray`, …)   |
| `'drizzle-orm/sqlite-core'`       | `'void/schema-d1'`      | Column helpers (`sqliteTable`, `text`, …)   |
| `'drizzle-orm/d1'`                | (removed)               | `drizzle()` factory no longer used directly |
| `'@/lib/db'`                      | `'void/db'`             | And rename `getDb()` → `db`                 |
| `'@/lib/db/schema'`               | `'@schema'`             | New path alias                              |
| `'cloudflare:workers'` (for `DB`) | (removed via `void/db`) | DB binding access goes through `void/db`    |

## Verification gate

This phase is "done" when:

- `db/schema.ts` exports all tables, importable via `@schema`
- `void db status` reports a clean local state and applied migrations
- `void db studio` opens and shows tables with data (after `void db migrate`
  on a fresh local DB seeded from `database.sql`)
- A trivial loader test (`pages/index.server.ts` returning `db.select().from(recipe).limit(1)`)
  returns the expected shape under `vp dev`
- No file in `src/`, `pages/`, `routes/`, or `middleware/` imports from
  `drizzle-orm` or `drizzle-orm/*` directly
