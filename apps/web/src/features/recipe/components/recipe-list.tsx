import RecipeCard from '@client/features/recipe/components/recipe-card'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import { BookIcon } from '@recipe-organizer/design-system/icons/book'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { Skeleton } from '@recipe-organizer/design-system/skeleton'
import { incrementalArray } from '@recipe-organizer/shared/utils/array'
import { Link } from '@tanstack/react-router'

import * as styles from './recipe-list.css'

export const RecipeListSkeleton = () => (
  <div className={styles.container}>
    {incrementalArray({ length: 6 }).map((index) => (
      <Skeleton preset="recipe-card" key={index} />
    ))}
  </div>
)

export const RecipeListContent = ({ recipes, canCreate }: { readonly recipes: ReducedRecipe[]; readonly canCreate: boolean }) => {
  const visibleRecipes = recipes.filter((recipe) => !recipe.isSpice)

  return (
    <>
      {visibleRecipes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <BookIcon size="xl" />
          </div>
          <p className={styles.text}>Aucune recette</p>
          {canCreate && (
            <Button render={<Link to="/recipe/new" viewTransition />}>
              <PlusIcon size="sm" />
              Ajouter une recette
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.recipeGrid}>
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard recipe={recipe} index={index} key={recipe.id} />
          ))}
        </div>
      )}
      {canCreate && (
        <div className={styles.floatingAction}>
          <Button aria-label="Ajouter une recette" render={<Link to="/recipe/new" viewTransition />} size="icon-xl">
            <PlusIcon size="xl" />
          </Button>
        </div>
      )}
    </>
  )
}
