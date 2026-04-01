import { type InferSelectModel } from 'drizzle-orm'

import { type ingredient, type ingredientCategory } from '@/lib/db/schema'

export type Ingredient = InferSelectModel<typeof ingredient>

export type IngredientCategory = (typeof ingredientCategory)[number]
