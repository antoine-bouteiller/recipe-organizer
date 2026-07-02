import { type ingredient, type ingredientCategory } from '@schema'
import { type InferSelectModel } from 'drizzle-orm'

export type Ingredient = InferSelectModel<typeof ingredient>

export type IngredientCategory = (typeof ingredientCategory)[number]
