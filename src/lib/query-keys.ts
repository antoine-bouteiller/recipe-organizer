export const queryKeys = {
  allIngredients: ['ingredients'] as const,
  allRecipes: ['recipes'] as const,
  allUnits: ['units'] as const,
  detailIngredient: (id: string) => [...queryKeys.allIngredients, id] as const,
  listIngredients: () => [...queryKeys.allIngredients, 'list'] as const,

  recipeDetail: (id: number) => [...queryKeys.allRecipes, 'detail', id] as const,
  recipeInstructions: (id: number) => [...queryKeys.allRecipes, 'instructions', id] as const,
  recipeLists: () => [...queryKeys.allRecipes, 'list'] as const,
  recipeList: () => [...queryKeys.recipeLists(), 'all'] as const,
  recipeListByIds: (ids: number[]) => [...queryKeys.recipeLists(), ids] as const,

  unitDetail: (id: number) => [...queryKeys.unitDetails(), id] as const,
  unitDetails: () => [...queryKeys.allUnits, 'detail'] as const,
  unitList: () => [...queryKeys.allUnits, 'list'] as const,
}
