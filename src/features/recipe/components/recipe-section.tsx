import { UNITS } from '@schema'

import { type Recipe, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { useRecipeQuantities } from '@/features/recipe/hooks/use-recipe-quantities'
import { formatNumber } from '@/utils/number'
import { scaleQuantity } from '@/utils/scale-quantity'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
}

const RecipeGroupIngredients = ({ baseServings, groupIngredients, servings }: RecipeGroupIngredientsProps) =>
  groupIngredients.length > 0 && (
    <ul className="mt-0 mb-0 list-none overflow-hidden rounded-2xl border bg-card px-3.5 pl-3.5">
      {groupIngredients.map((groupIngredient) => (
        <li className="mt-0 mb-0 border-b py-3 last:border-b-0" key={groupIngredient.id}>
          <div className="flex items-center gap-3 text-nowrap text-ellipsis">
            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
            <div className="flex-1">{groupIngredient.ingredient.name}</div>
            <div className="font-semibold text-muted-foreground">
              {formatNumber(scaleQuantity(groupIngredient.quantity, servings, baseServings))}
              {groupIngredient.unitSlug && ` ${UNITS[groupIngredient.unitSlug]?.name ?? ''}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

interface RecipeIngredientGroupsProps {
  readonly recipeId: number
  readonly baseServings: number
  readonly ingredientGroups: Recipe['ingredientGroups']
}

export const RecipeIngredientGroups = ({ recipeId, baseServings, ingredientGroups }: RecipeIngredientGroupsProps) => {
  const { quantity } = useRecipeQuantities(recipeId, baseServings)

  return ingredientGroups.map((group) => (
    <div className="mb-4 last:mb-0" key={group.id}>
      {group.groupName && <div className="mb-2 px-1 font-semibold">{group.groupName}</div>}

      <RecipeGroupIngredients baseServings={baseServings} groupIngredients={group.groupIngredients} servings={quantity} />
    </div>
  ))
}
