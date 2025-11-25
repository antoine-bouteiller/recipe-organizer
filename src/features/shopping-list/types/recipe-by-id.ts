import type { IngredientCategory } from '@/types/ingredient'

export interface RecipeById {
  id: number
  quantity: number
  ingredients: {
    id: number
    quantity: number
    category: IngredientCategory
    parentId: number | null
    name: string
    unit?: string
  }[]
}
