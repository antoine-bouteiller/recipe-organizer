export const ingredientCategory = ['meat', 'fish', 'vegetables', 'spices', 'other'] as const

export type IngredientCategory = (typeof ingredientCategory)[number]
