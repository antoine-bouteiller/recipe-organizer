import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { clearRecentRecipes, useRecentRecipeIds } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { css } from '@recipe-organizer/design-system/css'

export interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

const RecipeCardList = ({ recipes }: RecentRecipesProps) => (
  <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', gap: '2.5' })}>
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
    <div className={css({ display: 'flex', flex: '1', flexDirection: 'column' })}>
      <div className={css({ alignItems: 'center', display: 'flex', justifyContent: 'space-between', paddingBottom: '1', paddingTop: '2' })}>
        <h2
          className={css({ color: 'muted-foreground', fontSize: 'xs', fontWeight: 'semibold', letterSpacing: 'wider', textTransform: 'uppercase' })}
        >
          Recherches récentes
        </h2>
        <button className={css({ color: 'primary', fontSize: 'sm', fontWeight: 'semibold' })} onClick={clearRecentRecipes} type="button">
          Effacer
        </button>
      </div>
      <RecipeCardList recipes={recentRecipes} />
    </div>
  )
}
