import type { IngredientCategory } from '@/types/ingredient'

export interface RecipeById {
  id: number
  ingredients: {
    category: IngredientCategory
    id: number
    name: string
    parentId: null | number
    quantity: number
    unit?: string
  }[]
  quantity: number
}
