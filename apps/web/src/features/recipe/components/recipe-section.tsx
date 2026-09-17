import { type Recipe, type RecipeIngredientGroup } from '@client/features/recipe/api/get-one'
import { useRecipeQuantities } from '@client/features/recipe/hooks/use-recipe-quantities'
import { formatNumber } from '@client/utils/number'
import { UNITS } from '@recipe-organizer/shared/units'
import { scaleQuantity } from '@recipe-organizer/shared/utils/scale-quantity'

import * as styles from './recipe-section.css'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
  presentation: 'standalone' | 'embedded'
}

const RecipeGroupIngredients = ({ baseServings, groupIngredients, presentation, servings }: RecipeGroupIngredientsProps) =>
  groupIngredients.length > 0 && (
    <ul className={styles.ingredients[presentation]}>
      {groupIngredients.map((groupIngredient) => (
        <li className={styles.ingredient} key={groupIngredient.id}>
          <div className={styles.ingredientLine}>
            <span className={styles.bullet} />
            <div className={styles.ingredientName}>{groupIngredient.ingredient.name}</div>
            <div className={styles.quantity}>
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
    <div className={styles.group} key={group.id}>
      {group.groupName && <div className={styles.groupName}>{group.groupName}</div>}

      <RecipeGroupIngredients baseServings={baseServings} groupIngredients={group.groupIngredients} presentation={presentation} servings={quantity} />
    </div>
  ))
}
