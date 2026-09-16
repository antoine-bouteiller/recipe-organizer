import { addRecentRecipe } from '@client/stores/recent-recipes.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { staggerStyle } from '@client/utils/stagger'
import { Badge } from '@recipe-organizer/design-system/badge'
import { css } from '@recipe-organizer/design-system/css'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@recipe-organizer/shared/recipe/constants'
import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

export interface RecipeSearchCardProps {
  recipe: ReducedRecipe
  action?: ReactNode
  index?: number
}

export const RecipeSearchCard = ({ recipe, action, index = 0 }: RecipeSearchCardProps) => (
  <div className={`${css({ position: 'relative' })} stagger-in-45`} style={staggerStyle(index, 10)}>
    <Link
      className={css({
        alignItems: 'center',
        background: 'card',
        borderRadius: '2xl',
        borderWidth: '1px',
        display: 'flex',
        gap: '3',
        padding: '2.5',
        paddingRight: action ? '14' : undefined,
      })}
      onClick={() => addRecentRecipe(recipe.id)}
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
      viewTransition
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className={css({ borderRadius: 'xl', flexShrink: '0', height: '15', objectFit: 'cover', width: '15' })}
        decoding="async"
        loading={index < 6 ? 'eager' : 'lazy'}
      />
      <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', gap: '1.5', minWidth: '0' })}>
        <span className={css({ color: 'foreground', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>
          {recipe.name}
        </span>
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '1.5' })}>
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
    {action && <div className={css({ position: 'absolute', right: '2.5', top: '50%', transform: 'translateY(-50%)' })}>{action}</div>}
  </div>
)
