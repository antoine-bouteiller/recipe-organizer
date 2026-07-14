import { type recipe } from '@schema'
import { type InferSelectModel } from 'drizzle-orm'

type Recipe = InferSelectModel<typeof recipe>

export type ReducedRecipe = Pick<Recipe, 'cuisineTypes' | 'id' | 'image' | 'isMagimix' | 'isSpice' | 'isVegetarian' | 'meals' | 'name' | 'servings'>
