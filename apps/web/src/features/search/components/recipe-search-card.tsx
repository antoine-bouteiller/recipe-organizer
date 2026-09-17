import { addRecentRecipe } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { staggerStyle } from '@client/utils/stagger'
import { Badge } from '@recipe-organizer/design-system/badge'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import * as styles from './recipe-search-card.css'

export interface RecipeSearchCardProps {
  recipe: ReducedRecipe
  action?: ReactNode
  index?: number
}

export const RecipeSearchCard = ({ recipe, action, index = 0 }: RecipeSearchCardProps) => (
  <div className={styles.container} style={staggerStyle(index, 10)}>
    <Link
      className={styles.card[action ? 'withAction' : 'withoutAction']}
      onClick={() => addRecentRecipe(recipe.id)}
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
      viewTransition
    >
      <img src={recipe.image} alt={recipe.name} className={styles.image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
      <div className={styles.content}>
        <span className={styles.name}>{recipe.name}</span>
        <div className={styles.badges}>
          {recipe.isVegetarian && (
            <Badge size="sm" variant="accent">
              {VEGETARIAN_LABEL}
            </Badge>
          )}
          {recipe.isMagimix && (
            <Badge size="sm" variant="accent">
              {MAGIMIX_LABEL}
            </Badge>
          )}
          {recipe.isSpice && (
            <Badge size="sm" variant="accent">
              {SPICE_LABEL}
            </Badge>
          )}
          {recipe.meals.map((meal) => (
            <Badge key={meal} size="sm" variant="accent">
              {MEAL_LABELS[meal]}
            </Badge>
          ))}
          {recipe.cuisineTypes.map((cuisineType) => (
            <Badge key={cuisineType} size="sm" variant="accent">
              {CUISINE_TYPE_LABELS[cuisineType]}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
    {action && <div className={styles.action}>{action}</div>}
  </div>
)
