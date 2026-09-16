import { addRecentRecipe } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { staggerStyle } from '@client/utils/stagger'
import { Badge } from '@recipe-organizer/design-system/badge'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { action as actionClassName, badges, card, cardPadding, container, content, image, name } from './recipe-search-card.css'

export interface RecipeSearchCardProps {
  recipe: ReducedRecipe
  action?: ReactNode
  index?: number
}

export const RecipeSearchCard = ({ recipe, action, index = 0 }: RecipeSearchCardProps) => (
  <div className={`${container} stagger-in-45`} style={staggerStyle(index, 10)}>
    <Link
      className={`${card} ${cardPadding[action ? 'withAction' : 'withoutAction']}`}
      onClick={() => addRecentRecipe(recipe.id)}
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
      viewTransition
    >
      <img src={recipe.image} alt={recipe.name} className={image} decoding="async" loading={index < 6 ? 'eager' : 'lazy'} />
      <div className={content}>
        <span className={name}>{recipe.name}</span>
        <div className={badges}>
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
    {action && <div className={actionClassName}>{action}</div>}
  </div>
)
