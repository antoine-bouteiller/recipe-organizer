import { RecipeSearchCard } from '@/features/search/components/recipe-search-card'
import { clearRecentRecipes, useRecentRecipeIds } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'

interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

const RecipeCardList = ({ recipes }: RecentRecipesProps) => (
  <div className="flex flex-1 flex-col gap-2.5">
    {recipes.map((recipe) => (
      <RecipeSearchCard key={recipe.id} recipe={recipe} />
    ))}
  </div>
)

export const RecentRecipes = ({ recipes }: RecentRecipesProps) => {
  const recentRecipeIds = useRecentRecipeIds()

  const recentRecipes = recentRecipeIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is ReducedRecipe => recipe !== undefined)

  if (recentRecipes.length === 0) {
    return <RecipeCardList recipes={recipes} />
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pt-2 pb-1">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Recherches récentes</h2>
        <button onClick={clearRecentRecipes} type="button" className="text-sm font-semibold text-primary">
          Effacer
        </button>
      </div>
      <RecipeCardList recipes={recentRecipes} />
    </div>
  )
}
