---
title: Recipe CRUD
status: implemented
author: Antoine Bouteiller
date: 2026-08-14
parent-spec: src/features/recipe/spec/index.spec.md
related: [docs/infrastructure/server/data-layer.spec.md, docs/infrastructure/server/server-functions.spec.md]
---

## 2. Problem Statement

N/A — goals remain owned by `src/features/recipe/spec/index.spec.md` [G-1] and [G-4]. This leaf
owns the server-side boundary that turns a submitted recipe form into a valid, authorized aggregate.

## 3. Key Design Decisions

| Decision                       | Choice                                                                                                              | Rationale                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `[KD-1]` Validation boundary   | Create and update accept `FormData`, parse it into typed values, and validate it inside guarded server functions.   | Multipart files and structured form fields reach one trust boundary that gates storage effects.           |
| `[KD-2]` Aggregate replacement | Update removes outgoing graph rows atomically and writes the submitted ingredient and link graph.                   | The submitted form is the complete aggregate, avoiding an error-prone row-level diff.                     |
| `[KD-3]` Derived flags         | The write path derives `isVegetarian`, `isMagimix`, and `isSpice` from ingredients, links, meals, and instructions. | Durable flags stay consistent with the graph that produced them.                                          |
| `[KD-4]` Media lifecycle       | Images pass through a transform into R2; videos retain uploaded bytes; stale keys use best-effort deletion.         | Images have a bounded delivery format while media-cleanup failure does not invalidate a committed recipe. |

## 4. Principles & Intents

- `[PI-1]` **Validation gates effects** — malformed data does not reach R2 or D1.
- `[PI-2]` **Ownership protects every mutation** — an owner or admin alone can alter or remove a
  recipe, refining the umbrella [PI-1].
- `[PI-3]` **Graph writes are cohesive** — ingredient groups, their ingredients, and recipe links
  describe one submitted recipe.

## 5. Non-Goals

- `[NG-1]` Editing individual ingredient or link rows outside a recipe submission.
- `[NG-2]` Direct browser access to R2 write bindings.
- `[NG-3]` Deriving recipe flags in the editor or display layer.

## 6. Caveats

- `[C-1]` Foreign-key constraints require child rows to disappear ahead of their recipe or ingredient
  group parent.
- `[C-2]` A linked recipe relation prevents deleting the linked target until the referencing recipe
  removes its relation.
- `[C-3]` An instruction sub-recipe node is serialized JSON rather than a relational foreign key.
- `[C-4]` A graph-write failure triggers compensation that avoids exposing a partial aggregate.

## 7. High-Level Components

| Component     | Module type     | Responsibility                                          | Public API surface                               |
| ------------- | --------------- | ------------------------------------------------------- | ------------------------------------------------ |
| Create recipe | Server function | Validate input, store media, derive flags, create graph | `createRecipeOptions`, `recipeSchema`            |
| Update recipe | Server function | Authorize and replace aggregate data                    | `updateRecipeOptions`, `updateRecipeSchema`      |
| Delete recipe | Server function | Authorize and remove graph and image                    | `deleteRecipeOptions`                            |
| Write utility | Server utility  | Derive flags and write ingredient/link rows             | `resolveAutoFlags`, `writeRecipeIngredientGraph` |

## 8. Detailed Design

### 8.1 Aggregate shape

```text
recipe
├── ingredientGroups[]
│   └── ingredients[] { ingredientId, quantity, unitSlug? }
├── linkedRecipes[] { recipeId, ratio }
├── image key
├── video key?
└── instructions: Lexical JSON
```

The submitted aggregate includes a name, servings, meals, cuisine types, image, optional video,
ingredient groups, linked recipes, and instructions. The first persisted ingredient group is the
default group; named groups remain additional preparation groupings. List and detail leaves consume
the resulting recipe shapes.

### 8.2 Mutation flow

```text
FormData → guarded validator → ownership lookup → media keys + derived flags
         → D1 recipe and graph writes → query invalidation + French feedback
```

Create assigns the authenticated user as owner. Update and delete load the recipe and require its
owner or an admin. Update batches the recipe update, group-ingredient removal, ingredient-group
removal, and outgoing linked-recipe removal, then writes the submitted graph. Delete batches child
removal ahead of recipe removal and attempts image deletion once the database operation completes.

### 8.3 Input and authorization contract

The form-data parser preserves `File` values for media and decodes structured scalar fields for the
schema. A valid image is either a file or an already-held media reference; video is optional under
the same representation. Ingredient entries pair a non-negative ingredient id and quantity with an
optional unit. Linked-recipe entries pair a non-negative target id with a non-negative ratio.

Create binds `createdBy` to the authenticated user. Update and delete resolve the target aggregate
and apply the shared owner-or-admin policy. A missing target returns the route's not-found behavior;
an unauthorized target produces no media or database effect. The mutation-option layer translates
failure into the application's French feedback conventions.

### 8.4 Graph persistence and failure handling

The graph writer persists each ingredient group, marks the first group as default, persists its
ingredient rows, and persists outgoing recipe links. A D1 batch groups the destructive phase of an
update or delete to satisfy foreign-key ordering. Create writes the recipe identity first, then
writes the graph; a graph error compensates by deleting that identity.

Media replacement stores the incoming file under an opaque key and later attempts deletion of stale
keys. The best-effort cleanup policy preserves the committed recipe when object deletion is
unavailable. Deleting a recipe similarly removes its image key as a separate object-store effect.

### 8.5 Query invalidation and caller contract

Each mutation exposes a React Query mutation-options factory rather than asking callers to know its
server-function details. Create invalidates recipe-list keys; update and delete invalidate the
all-recipes key family. A successful create or update also communicates the recipe title through the
French toast surface, while error handling maps a rejected server operation to the same UI language.

The write boundary returns the durable identity where a caller needs it and otherwise leaves rendered
server state to the query layer. This preserves the architecture separation between server data and
client UI state: mutation completion causes a refetch instead of maintaining a second recipe copy in
a browser store.

### 8.6 Media representation

An image file becomes a Cloudflare Images transformed WebP object with a bounded width and quality,
then stores under a random R2 key. A video file stores its bytes and supplied content type under the
same opaque-key model. A retained media reference supplies its stored id rather than triggering an
upload, allowing an unchanged file to stay attached to a revised aggregate.

The database stores keys rather than public object URLs. Display resolves keys through application
media routes, which own read-time cache headers and development placeholder behavior. Possession of a
key is therefore an internal storage reference, not a browser upload capability.

### 8.7 Flags and media

Vegetarian status requires no meat or fish among own ingredients, vegetarian linked recipes, and no
dessert meal. Magimix status follows the `"type":"magimixProgram"` marker emitted by the editor
leaf [KD-2]. Spice status derives from the submitted meal selection and ingredient graph. Image
uploads pass through the Cloudflare Images transformation and receive opaque R2 keys; video uploads
keep their content type and opaque keys.

Mutation success invalidates recipe list keys so display and search refetch the aggregate projection.

## 9. Open Questions

N/A
