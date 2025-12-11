import type { Recipe, RecipeIngredientGroup } from '@/features/recipe/api/get-one'

import { formatNumber } from '@/utils/number'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
}

const RecipeGroupIngredients = ({ baseServings, groupIngredients, servings }: RecipeGroupIngredientsProps) =>
  groupIngredients.length > 0 && (
    <ul
      className={`
        mt-0 mb-0 space-y-2 pr-4
        md:pr-2
      `}
    >
      {groupIngredients.map((groupIngredient) => (
        <li key={groupIngredient.id}>
          <div
            className={`
              flex items-center justify-between gap-2 text-nowrap text-ellipsis
            `}
          >
            <div>{groupIngredient.ingredient.name}</div>
            <div className="font-medium">
              {formatNumber((groupIngredient.quantity * servings) / baseServings)}
              {groupIngredient.unit && ` ${groupIngredient.unit.name}`}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )

interface RecipeIngredientGroupsProps {
  baseServings: number
  ingredientGroups: Recipe['ingredientGroups']
  servings: number
}

export const RecipeIngredientGroups = ({ baseServings, ingredientGroups, servings }: RecipeIngredientGroupsProps) =>
  ingredientGroups.map((group) => (
    <div key={group.id}>
      {group.groupName && <div className="font-semibold">{group.groupName}</div>}

      <RecipeGroupIngredients baseServings={baseServings} groupIngredients={group.groupIngredients} servings={servings} />

      {group.embeddedRecipe && (
        <RecipeGroupIngredients
          baseServings={baseServings}
          groupIngredients={group.embeddedRecipe.ingredientGroups[0].groupIngredients}
          servings={servings}
        />
      )}
    </div>
  ))
