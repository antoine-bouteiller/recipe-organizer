export const queryKeys = {
  allIngredients: ['ingredients'] as const,
  allRecipes: ['recipes'] as const,
  allUnits: ['units'] as const,
  allUsers: ['users'] as const,
  detailIngredient: (id: string) => [...queryKeys.allIngredients, id] as const,
  listIngredients: () => [...queryKeys.allIngredients, 'list'] as const,

  listUsers: (status?: string) => [...queryKeys.allUsers, 'list', status ?? 'active'] as const,
  recipeDetail: (id: number) => [...queryKeys.allRecipes, 'detail', id] as const,
  recipeInstructions: (id: number) => [...queryKeys.allRecipes, 'instructions', id] as const,
  recipeList: () => [...queryKeys.recipeLists(), 'all'] as const,
  recipeListByIds: (ids: number[]) => [...queryKeys.recipeLists(), ids] as const,

  recipeLists: () => [...queryKeys.allRecipes, 'list'] as const,
  unitDetail: (id: number) => [...queryKeys.unitDetails(), id] as const,
  unitDetails: () => [...queryKeys.allUnits, 'detail'] as const,

  unitList: () => [...queryKeys.allUnits, 'list'] as const,
}
