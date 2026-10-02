import type { listRecipes } from '@recipe-organizer/server/recipe/queries'

export type ReducedRecipe = Awaited<ReturnType<typeof listRecipes>>[number]
