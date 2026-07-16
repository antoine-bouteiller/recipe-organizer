import { UNITS } from '@schema'
import { For, Show } from 'solid-js'

import { type Recipe, type RecipeIngredientGroup } from '@/features/recipe/api/get-one'
import { useRecipeQuantities } from '@/features/recipe/hooks/use-recipe-quantities'
import { formatNumber } from '@/utils/number'
import { scaleQuantity } from '@/utils/scale-quantity'

interface RecipeGroupIngredientsProps {
  baseServings: number
  groupIngredients: RecipeIngredientGroup['groupIngredients']
  servings: number
}

const RecipeGroupIngredients = (props: RecipeGroupIngredientsProps) => (
  <Show when={props.groupIngredients.length > 0}>
    <ul class="mt-0 mb-0 list-none overflow-hidden rounded-2xl border bg-card px-3.5 pl-3.5">
      <For each={props.groupIngredients}>
        {(groupIngredient) => (
          <li class="mt-0 mb-0 border-b py-3 last:border-b-0">
            <div class="flex items-center gap-3 text-nowrap text-ellipsis">
              <span class="size-1.5 shrink-0 rounded-full bg-primary" />
              <div class="flex-1">{groupIngredient.ingredient.name}</div>
              <div class="font-semibold text-muted-foreground">
                {formatNumber(scaleQuantity(groupIngredient.quantity, props.servings, props.baseServings))}
                {groupIngredient.unitSlug && ` ${UNITS[groupIngredient.unitSlug]?.name ?? ''}`}
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  </Show>
)

interface RecipeIngredientGroupsProps {
  readonly recipeId: number
  readonly baseServings: number
  readonly ingredientGroups: Recipe['ingredientGroups']
}

export const RecipeIngredientGroups = (props: RecipeIngredientGroupsProps) => {
  const { quantity } = useRecipeQuantities(props.recipeId, props.baseServings)

  return (
    <For each={props.ingredientGroups}>
      {(group) => (
        <div class="mb-4 last:mb-0">
          <Show when={group.groupName}>
            <div class="mb-2 px-1 font-semibold">{group.groupName}</div>
          </Show>
          <RecipeGroupIngredients baseServings={props.baseServings} groupIngredients={group.groupIngredients} servings={quantity()} />
        </div>
      )}
    </For>
  )
}
