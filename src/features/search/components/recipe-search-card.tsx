import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/utils/constants'
import { addRecentRecipe } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'
import { cn } from '@/utils/cn'

interface RecipeSearchCardProps {
  recipe: ReducedRecipe
  action?: ReactNode
}

export const RecipeSearchCard = ({ recipe, action }: RecipeSearchCardProps) => (
  <div className="relative">
    <Link
      className={cn('flex items-center gap-3 rounded-2xl border bg-card p-2.5', action && 'pr-14')}
      onClick={() => addRecentRecipe(recipe.id)}
      params={{ id: recipe.id.toString() }}
      to="/recipe/$id"
      viewTransition
    >
      <img src={recipe.image} alt={recipe.name} className="size-15 shrink-0 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate font-bold text-foreground">{recipe.name}</span>
        <div className="flex flex-wrap gap-1.5">
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
    {action && <div className="absolute top-1/2 right-2.5 -translate-y-1/2">{action}</div>}
  </div>
)
