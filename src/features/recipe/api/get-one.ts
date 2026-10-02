import type { getRecipeDetails } from '@recipe-organizer/server/recipe/queries'

export type Recipe = NonNullable<Awaited<ReturnType<typeof getRecipeDetails>>>
export type RecipeIngredientGroup = Recipe['ingredientGroups'][number]
