import type { ReducedRecipe } from '@client/types/recipe'
import { Badge } from '@recipe-organizer/design-system/badge'
import { Button } from '@recipe-organizer/design-system/button'
import { BookIcon, PlusIcon } from '@recipe-organizer/design-system/icons'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@void/react'
import type { ReactNode } from 'react'

import * as cardStyles from './recipe-card.css'
import * as styles from './recipe-list.css'

export interface RecipeListContentProps {
  readonly canCreate: boolean
  readonly recipes: ReducedRecipe[]
  /** Interactive per-card controls; island pages pass an island here. */
  readonly renderCardAction: (recipe: ReducedRecipe) => ReactNode
}

export const RecipeListContent = ({ canCreate, recipes, renderCardAction }: RecipeListContentProps) => {
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
            <Button asLink href="/recipe/new">
              <PlusIcon size="sm" />
              Ajouter une recette
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.recipeGrid}>
          {visibleRecipes.map((recipe, index) => (
            <article className={cardStyles.card} key={recipe.id}>
              <img alt={recipe.name} className={cardStyles.image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} src={recipe.image} />
              <Link className={cardStyles.recipeLink} href={`/recipe/${recipe.id}`}>
                <div className={cardStyles.tags}>
                  {recipe.isVegetarian && (
                    <Badge size="sm" variant="secondary">
                      {VEGETARIAN_LABEL}
                    </Badge>
                  )}
                  {recipe.isMagimix && (
                    <Badge size="sm" variant="secondary">
                      {MAGIMIX_LABEL}
                    </Badge>
                  )}
                  {recipe.isSpice && (
                    <Badge size="sm" variant="secondary">
                      {SPICE_LABEL}
                    </Badge>
                  )}
                  {recipe.meals.map((meal) => (
                    <Badge key={meal} size="sm" variant="secondary">
                      {MEAL_LABELS[meal]}
                    </Badge>
                  ))}
                  {recipe.cuisineTypes.map((cuisineType) => (
                    <Badge key={cuisineType} size="sm" variant="secondary">
                      {CUISINE_TYPE_LABELS[cuisineType]}
                    </Badge>
                  ))}
                </div>
                <h2 className={cardStyles.heading}>{recipe.name}</h2>
              </Link>
              {renderCardAction(recipe)}
            </article>
          ))}
        </div>
      )}
      {canCreate && (
        <div className={styles.floatingAction}>
          <Button aria-label="Ajouter une recette" asLink href="/recipe/new" size="icon-xl">
            <PlusIcon size="xl" />
          </Button>
        </div>
      )}
    </>
  )
}
