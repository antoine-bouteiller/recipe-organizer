export const queryKeys = {
  allIngredients: ['ingredients'] as const,
  allRecipes: ['recipes'] as const,
  allUnits: ['units'] as const,
  detailIngredient: (id: string) => [...queryKeys.allIngredients, id] as const,
  listIngredients: () => [...queryKeys.allIngredients, 'list'] as const,

  recipeDetail: (id: number) => [...queryKeys.allRecipes, 'detail', id] as const,
  recipeList: (search?: string) => [...queryKeys.recipeLists(), 'all', search] as const,
  recipeListByIds: (ids: number[]) => [...queryKeys.recipeLists(), ids] as const,

  recipeLists: () => [...queryKeys.allRecipes, 'list'] as const,
  unitDetail: (id: number) => [...queryKeys.unitDetails(), id] as const,
  unitDetails: () => [...queryKeys.allUnits, 'detail'] as const,
  unitList: () => [...queryKeys.allUnits, 'list'] as const,
}
