import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { clearRecentRecipes, useRecentRecipeIds } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'

import * as styles from './recent-recipes.css'

export interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipes = ({ recipes }: RecentRecipesProps) => {
  const recentRecipeIds = useRecentRecipeIds()

  const recentRecipes = recentRecipeIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is ReducedRecipe => recipe !== undefined)

  if (recentRecipes.length === 0) {
    return (
      <div className={styles.container}>
        {recipes.map((recipe) => (
          <RecipeSearchCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.recentRecipes}>
      <div className={styles.recentRecipesHeader}>
        <h2 className={styles.heading}>Recherches récentes</h2>
        <Button onClick={clearRecentRecipes} size="sm" variant="ghost">
          Effacer
        </Button>
      </div>
      <div className={styles.container}>
        {recentRecipes.map((recipe) => (
          <RecipeSearchCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
