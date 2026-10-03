import type { getRecipeDetails } from '@/features/recipe/server/queries'

export type Recipe = NonNullable<Awaited<ReturnType<typeof getRecipeDetails>>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]
