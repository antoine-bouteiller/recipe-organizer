import { clearRecentRecipes, useRecentRecipeIds } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'

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
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Recherches récentes</h2>
        <button onClick={clearRecentRecipes} type="button" className="text-sm font-semibold text-primary">
          Effacer
        </button>
      </div>
      <RecipeList recipes={recentRecipes} />
    </div>
  )
}
