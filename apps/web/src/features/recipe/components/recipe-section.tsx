import { type Recipe, type RecipeIngredientGroup } from '@client/features/recipe/api/get-one'
import { useRecipeQuantities } from '@client/features/recipe/hooks/use-recipe-quantities'
import { formatNumber } from '@client/utils/number'
import { UNITS } from '@recipe-organizer/shared/units'
import { scaleQuantity } from '@recipe-organizer/shared/utils/scale-quantity'

import {
  bullet,
  group as groupClassName,
  groupName,
  ingredient,
  ingredientLine,
  ingredientName,
  ingredients,
  quantity as quantityClassName,
} from './recipe-section.css'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
  presentation: 'standalone' | 'embedded'
}

const RecipeGroupIngredients = ({ baseServings, groupIngredients, presentation, servings }: RecipeGroupIngredientsProps) =>
  groupIngredients.length > 0 && (
    <ul className={ingredients[presentation]}>
      {groupIngredients.map((groupIngredient) => (
        <li className={ingredient} key={groupIngredient.id}>
          <div className={ingredientLine}>
            <span className={bullet} />
            <div className={ingredientName}>{groupIngredient.ingredient.name}</div>
            <div className={quantityClassName}>
              {formatNumber(scaleQuantity(groupIngredient.quantity, servings, baseServings))}
              {groupIngredient.unitSlug && ` ${UNITS[groupIngredient.unitSlug]?.name ?? ''}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

export interface RecipeIngredientGroupsProps {
  readonly recipeId: number
  readonly baseServings: number
  readonly ingredientGroups: Recipe['ingredientGroups']
  readonly presentation?: 'standalone' | 'embedded'
}

export const RecipeIngredientGroups = ({ recipeId, baseServings, ingredientGroups, presentation = 'standalone' }: RecipeIngredientGroupsProps) => {
  const { quantity } = useRecipeQuantities(recipeId, baseServings)

  return ingredientGroups.map((group) => (
    <div className={groupClassName} key={group.id}>
      {group.groupName && <div className={groupName}>{group.groupName}</div>}

      <RecipeGroupIngredients baseServings={baseServings} groupIngredients={group.groupIngredients} presentation={presentation} servings={quantity} />
    </div>
  ))
}
