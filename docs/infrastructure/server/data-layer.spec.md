---
title: D1 Data Layer
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: docs/infrastructure/server/server.spec.md
related: [docs/infrastructure/server/platform.spec.md, docs/infrastructure/server/server-functions.spec.md]
---

## 2. Problem Statement

Feature modules require typed relational reads and writes that fit a stateless Worker and preserve
recipe graph integrity. This leaf refines the architecture storage and ORM decisions [KD-3] and
[KD-4], while leaving feature business rules with their feature specs.

N/A — goals remain owned by `docs/architecture.spec.md`.

## 3. Key Design Decisions

| Decision                    | Choice                                                                                       | Rationale                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `[KD-1]` Database access    | `getDb()` creates a Drizzle D1 client from the Worker `DB` binding.                          | Request execution supplies the binding, so a retained cross-request client is unnecessary.    |
| `[KD-2]` Relation model     | Tables and `defineRelations` form one typed graph.                                           | Nested reads declare their traversal explicitly and relation names remain type-checked.       |
| `[KD-3]` Referential policy | Foreign-key removal uses restrict semantics; dependent deletion is explicit and child-first. | The write path makes destructive scope visible and avoids implicit cascades.                  |
| `[KD-4]` Atomic write unit  | Related independent statements use D1 `batch([...])`.                                        | D1 batches provide the multi-statement atomicity required by graph updates.                   |
| `[KD-5]` Query identity     | Query option factories use shared, hierarchical query keys.                                  | Mutations can invalidate every affected list and detail view without duplicating cache names. |

## 4. Principles & Intents

- `[PI-1]` **Request-scoped database handle** — refines server umbrella [PI-3]; call `getDb()` at
  a query or write site.
- `[PI-2]` **Relations describe traversal** — a `with` read is backed by an exported relation,
  rather than an untyped join convention.
- `[PI-3]` **Database writes preserve graph boundaries** — use batch ordering and feature-owned
  persistence helpers to retain row integrity.

## 5. Non-Goals

- `[NG-1]` Analytical workloads or a separate reporting database, refining architecture [NG-3].
- `[NG-2]` A repository layer that hides Drizzle query shape from feature APIs.
- `[NG-3]` SQL-side membership search over recipe classification arrays.

## 6. Caveats

- `[C-1]` D1 is SQLite and has the limitations called out by architecture [C-2].
- `[C-2]` A batch is atomic but statement ordering still matters for restrict foreign keys.
- `[C-3]` Query keys are client cache identities, not database identifiers; callers invalidate a
  broad key after a mutation.
- `[C-4]` Schema evolution includes committed Drizzle SQL and platform schema-application
  configuration; this specification defines the resulting schema contract, not an execution procedure.

## 7. High-Level Components

| Component                | Module type           | Responsibility                                    | Public API surface             |
| ------------------------ | --------------------- | ------------------------------------------------- | ------------------------------ |
| Database factory         | Server library        | Bind Drizzle to request-scoped D1                 | `getDb(): DrizzleD1Database`   |
| Schema exports           | Type modules          | Tables, value types, and relation graph           | `@schema` exports, `relations` |
| Recipe graph persistence | Feature server helper | Write dependent ingredient and linked-recipe rows | `writeRecipeIngredientGraph()` |
| Query keys               | Shared library        | Stable server-data cache namespaces               | `queryKeys`                    |

## 8. Detailed Design

### 8.1 Database factory

`getDb()` returns `drizzle(cloudflareEnv.DB, { relations })` (`src/lib/db.ts:1-5`). It is the only
application construction point for the D1 client. Consumers use the returned query builder for
reads, inserts, updates, deletes, and batches; they do not retain a binding-derived client in
module state.

### 8.2 Schema and relation graph

The schema index re-exports domain tables and units (`db/schema/index.ts:9-15`) and defines the
relation graph (`db/schema/index.ts:17-76`). Recipe traversal includes creator, ingredient groups,
and both directions of linked recipes (`db/schema/index.ts:34-49`); ingredient traversal includes
its parent and group uses (`db/schema/index.ts:28-33`). A relation addition accompanies each
nested `with` access that relies on it.

### 8.3 Read contract

Read handlers prefer `getDb().query.<table>.findFirst` or `findMany` with a narrow `columns`,
`where`, `with`, and ordering shape. The relation graph determines valid `with` keys, making the
selected object shape a server-function contract rather than a client-assembled query.

### 8.4 Write and deletion contract

A graph write persists its root row and dependent rows within the feature write boundary. For
deletion, dependent `groupIngredient`, ingredient-group, and linked-recipe rows precede the recipe
row in one batch (`src/features/recipe/api/delete.ts:40-55`); the owned R2 file is removed only
after that batch resolves (`src/features/recipe/api/delete.ts:56`). This keeps a database failure
from leaving a row that points to a missing object.

### 8.5 Query-key contract

`queryKeys` groups recipes, ingredients, and users under broad roots and derives list/detail keys
from them (`src/lib/query-keys.ts:1-12`). A query factory uses the narrow key needed to read;
a mutation invalidates the broadest affected root or list. This refines architecture [PI-4]: the
client cache is server data, while UI stores retain selections only.

### 8.6 Interaction boundary

Server functions own validation, authorization, and the API return shape. The data layer owns typed
persistence primitives; it does not decide who may mutate a row. Platform owns the `DB` binding
whose configured name is `DB` (`wrangler.jsonc:15-21`).

### 8.7 Table ownership boundary

Schema modules own table declarations and reusable column types. Feature APIs own the domain
meaning of rows they select and mutate, including whether a result is suitable for a list, detail,
or administrative surface. This prevents a persistence helper from silently becoming a second
business-policy layer.

The schema index is the import boundary for table and relation symbols. Its explicit exports allow
Drizzle configuration and application code to use one typed vocabulary instead of reaching into
unrelated schema modules (`db/schema/index.ts:9-17`).

### 8.8 Batch boundary

A batch contains statements whose result does not require a generated value from an earlier
statement. When a dependent row needs a generated parent identifier, the feature write path obtains
the identifier and then writes the dependent rows through its graph helper. This separates the D1
atomic unit from dependencies that only exist after a return value is available.

A batch failure leaves its grouped relational statements unapplied. Object storage is outside that
unit, so server functions order object effects deliberately and surface failures instead of treating
them as database success.

### 8.9 Cache invalidation boundary

Query keys form prefixes: `allRecipes` contains recipe lists, details, and instructions, while the
more specific helpers add a purpose and identifier (`src/lib/query-keys.ts:1-12`). A mutation
chooses a prefix that covers every representation it can make stale.

Invalidation requests a refetch on later observation; it does not modify cached domain objects in
place. This keeps cache coherence tied to the server's persisted result and reinforces architecture
[PI-4].

### 8.10 Failure behavior

A missing row remains a feature API concern because different calls may return an optional result or
router not-found control flow. The data layer exposes the query result without imposing either
response semantics.

Constraint failures and provider failures propagate to the server-function error boundary. That
boundary maps user-visible errors while retaining the original cause for server diagnosis.

### 8.11 Contract sketch

The data entry point is `getDb() -> Drizzle client`; table and relation exports provide the typed
inputs to that client. Feature APIs use these shapes to state their own read and write contracts.

## 9. Open Questions

N/A
