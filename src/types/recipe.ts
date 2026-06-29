import { type InferSelectModel } from 'drizzle-orm'

import { type recipe } from '@/lib/db/schema'

export type CuisineType = 'mediterranean' | 'chinese' | 'japanese' | 'indian' | 'mexican' | 'italian' | 'french'
export type Meal = 'breakfast' | 'lunch' | 'diner' | 'dessert'

export type Recipe = InferSelectModel<typeof recipe>

export type ReducedRecipe = Pick<Recipe, 'cuisineTypes' | 'id' | 'image' | 'isMagimix' | 'isSpice' | 'isVegetarian' | 'meals' | 'name' | 'servings'>
