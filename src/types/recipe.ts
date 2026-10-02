import type { listRecipes } from '@/features/recipe/server/queries'

export type ReducedRecipe = Awaited<ReturnType<typeof listRecipes>>[number]
