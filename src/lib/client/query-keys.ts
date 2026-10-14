export const queryKeys = {
  allIngredients: ['ingredients'] as const,
  allRecipes: ['recipes'] as const,
  allUsers: ['users'] as const,
  ingredientList: () => [...queryKeys.allIngredients, 'list'] as const,
  recipeDetail: (id: number) => [...queryKeys.allRecipes, 'detail', id] as const,
  recipeList: () => [...queryKeys.allRecipes, 'list', 'all'] as const,
  recipeListByIds: (ids: readonly number[]) => [...queryKeys.allRecipes, 'list', ids] as const,
  session: ['session'] as const,
  userList: (status: 'active' | 'blocked' | 'pending') => [...queryKeys.allUsers, 'list', status] as const,
}
