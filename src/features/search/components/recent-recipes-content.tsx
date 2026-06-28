import { type ReducedRecipe } from '@/features/recipe/api/get-all'
import { useRecentRecipeIds } from '@/stores/recent-recipes.store'

import { RecipeList } from './recipe-list'

interface RecentRecipesContentProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipesContent = ({ recipes }: RecentRecipesContentProps) => {
  const recentRecipeIds = useRecentRecipeIds()

  const recentRecipes = recentRecipeIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is ReducedRecipe => recipe !== undefined)

  if (recentRecipes.length === 0) {
    return <RecipeList recipes={recipes} />
  }

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="px-4 pt-2 pb-1 text-sm font-medium text-muted-foreground">Recherches récentes</h2>
      <RecipeList recipes={recentRecipes} />
    </div>
  )
}
