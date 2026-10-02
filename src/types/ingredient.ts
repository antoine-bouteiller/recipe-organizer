import type { listIngredients } from '@/features/ingredients/server/queries'

export type Ingredient = Awaited<ReturnType<typeof listIngredients>>[number]
