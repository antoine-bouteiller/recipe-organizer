import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { clearRecentRecipes, useRecentRecipeIds } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'

import { container, container2, container3, heading, element } from './recent-recipes.css'

export interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

const RecipeCardList = ({ recipes }: RecentRecipesProps) => (
  <div className={container}>
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
    <div className={container2}>
      <div className={container3}>
        <h2 className={heading}>Recherches récentes</h2>
        <button className={element} onClick={clearRecentRecipes} type="button">
          Effacer
        </button>
      </div>
      <RecipeCardList recipes={recentRecipes} />
    </div>
  )
}
