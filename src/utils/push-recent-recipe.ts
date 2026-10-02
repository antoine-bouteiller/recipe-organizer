const MAX_RECENT_RECIPES = 10

export const pushRecentRecipe = (ids: readonly number[], recipeId: number) =>
  [recipeId, ...ids.filter((id) => id !== recipeId)].slice(0, MAX_RECENT_RECIPES)
