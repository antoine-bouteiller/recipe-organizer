import type { RecipeById } from './recipe-by-id'

export type IngredientCartItem = RecipeById['ingredients'][number] & {
  unit: string | undefined
  checked: boolean
}
