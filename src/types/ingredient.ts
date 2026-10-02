import type { listIngredients } from '@recipe-organizer/server/ingredients/queries'

export type Ingredient = Awaited<ReturnType<typeof listIngredients>>[number]
