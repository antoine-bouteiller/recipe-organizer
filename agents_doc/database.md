# Database

**ORM**: Drizzle ORM - [Full docs](https://orm.drizzle.team/llms-full.txt)
**Schema location**: `src/lib/db/schema/`

## Tables

### `user`

```typescript
// src/lib/db/schema/user.ts
id: text (PK)
email: text (NOT NULL, UNIQUE)
role: text (NOT NULL, DEFAULT 'user') // 'user' | 'admin'
```

### `recipes`

```typescript
// src/lib/db/schema/recipe.ts
id: integer (PK)
name: text(255) (NOT NULL)
image: text(255) (NOT NULL)          // R2 image key
quantity: integer (NOT NULL)         // Number of servings
steps: text (NOT NULL)               // HTML from TipTap
tags: text JSON (DEFAULT [])         // string[]

Relations:
- hasMany: recipe_ingredients_sections (as recipe)
- hasMany: recipe_ingredients_sections (as sub-recipe)
```

### `ingredients`

```typescript
// src/lib/db/schema/ingredient.ts
id: integer (PK)
name: text (NOT NULL)
category: text (NOT NULL, DEFAULT 'other') // 'meat' | 'fish' | 'vegetables' | 'spices' | 'other'
parent_id: integer (FK → ingredients.id)   // For variants

Relations:
- belongsTo: ingredient (parent)
- hasMany: section_ingredients
```

### `units`

```typescript
// src/lib/db/schema/unit.ts
id: integer (PK)
name: text (NOT NULL)
parent_id: integer (FK → units.id)    // For conversion chain
factor: real                          // Conversion factor to parent

Relations:
- belongsTo: unit (parent)
- hasMany: section_ingredients
```

### `recipe_ingredients_sections`

```typescript
// src/lib/db/schema/recipe-ingredients.ts
id: integer (PK)
recipe_id: integer (NOT NULL, FK → recipes.id, CASCADE)
name: text(255)                       // Optional section name
is_default: boolean (NOT NULL, DEFAULT false)
sub_recipe_id: integer (FK → recipes.id, CASCADE)  // For composite recipes
ratio: real                           // Sub-recipe ratio

Relations:
- belongsTo: recipe
- belongsTo: recipe (as sub_recipe)
- hasMany: section_ingredients

Notes:
- Section contains EITHER ingredients OR a sub-recipe (not both)
```

### `section_ingredients`

```typescript
// src/lib/db/schema/recipe-ingredients.ts
id: integer (PK)
section_id: integer (NOT NULL, FK → recipe_ingredients_sections.id, CASCADE)
ingredient_id: integer (NOT NULL, FK → ingredients.id, CASCADE)
quantity: real (NOT NULL)
unit_id: integer (FK → units.id, SET NULL)  // Optional

Relations:
- belongsTo: recipe_ingredients_section
- belongsTo: ingredient
- belongsTo: unit (optional)
```

## Relationships

```
recipes
  ├─→ recipe_ingredients_sections
  │     ├─→ section_ingredients
  │     │     ├─→ ingredients
  │     │     └─→ units
  │     └─→ recipes (sub-recipe)

ingredients
  ├─→ self (parent-child variants)
  └─→ section_ingredients

units
  ├─→ self (conversion chain)
  └─→ section_ingredients

user (standalone)
```

## Key Patterns

1. **Hierarchical ingredients**: Parent-child for variants ("Tomato" → "Cherry Tomato")
2. **Hierarchical units**: Parent-child with factor for conversions (1000g = 1kg)
3. **Recipe sections**: Group ingredients (e.g., "For the dough", "For the sauce")
4. **Composite recipes**: Recipe can reference another recipe as ingredient
5. **Cascade deletes**: CASCADE on recipes/ingredients, SET NULL on units
6. **Optional units**: unit_id can be null for items without units
