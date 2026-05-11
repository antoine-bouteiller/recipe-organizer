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

Migration file shape changes from directory-per-migration to
file-per-migration. The lineage is **preserved** (D11) — one new
`db/migrations/<timestamp>_<name>.sql` per existing
`migrations/<dir>/migration.sql`, keeping the original timestamp ordering.

**Action (local repo):**

1. For each existing `migrations/<timestamp>_<name>/migration.sql`, copy
   the SQL body into `db/migrations/<timestamp>_<name>.sql`. Drop the
   per-migration directory and its `meta/` siblings — Void manages
   migration metadata via its own tracking table.
2. Run `void db reset` to validate the flattened set replays cleanly
   against a fresh local D1.
3. Run `void db generate` afterward. It must report **no drift** — if it
   emits an additional migration, the flatten was incomplete.
4. From this point forward, all schema changes go through
   `void db generate`, producing new file-per-migration entries.

**Action (remote/production D1 tracking table):**

The Cloudflare-side reconciliation — populating Void's migration tracking
table with the existing applied migrations so `void db migrate --remote`
treats them as already-applied — is **handled out of band by the
project owner** and is not scripted by this migration spec. The user has
explicitly taken ownership of this step (D11). Coordinate the cutover
window:

- Last `wrangler d1 export` snapshot taken before cutover.
- Project owner runs the manual reconciliation SQL on production D1.
- Then a `void db status --remote` (or equivalent) is run from the
  branch to confirm the remote shows "no pending migrations".
- Only then is `wrangler deploy` to production unblocked.

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

The codebase already validates with Valibot end-to-end. Where shapes align
with the DB, switch hand-written object schemas to `void/drizzle-valibot`
so the validator stays in sync with the table.

```ts
// db/schema/recipe.ts (excerpt)
import { sqliteTable, text, integer } from 'void/schema-d1'
import { createInsertSchema, createUpdateSchema } from 'void/drizzle-valibot'
import { pipe, minLength, minValue } from 'valibot'

export const recipe = sqliteTable('recipe', {
  /* … */
})

export const insertRecipeSchema = createInsertSchema(recipe, {
  name: (schema) => pipe(schema, minLength(2)),
  servings: (schema) => pipe(schema, minValue(0)),
})
export const updateRecipeSchema = createUpdateSchema(recipe)
```

Then in the action handler, extend the derived schema with the bespoke
non-DB fields (image, ingredient groups, linked recipes):

```ts
// pages/recipe/new.server.ts
import { defineHandler } from 'void'
import { db } from 'void/db'
import { recipe, insertRecipeSchema } from '@schema'
import * as v from 'valibot'

const createRecipeSchema = v.object({
  ...insertRecipeSchema.entries,
  image: v.union([v.instance(File), v.object({ id: v.string(), url: v.string() })]),
  ingredientGroups: v.array(
    v.object({
      /* … */
    })
  ),
  // … linked recipes, video …
})

export const action = defineHandler.withValidator({ body: createRecipeSchema })(async (c, { body }) => {
  /* … */
})
```

The complex non-DB parts (`image`, `ingredientGroups`, `linkedRecipes`) stay
as bespoke Valibot. The derived part keeps `name`, `servings`,
`instructions`, `tags` in sync with the table. The existing Valibot
`recipeSchema` in `src/features/recipe/api/create.ts` is migrated by
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
