import { For, Show } from 'solid-js'

import { ingredientCategoryIcons, ingredientCategoryLabels } from '@/components/ingredient-category'
import { Skeleton } from '@/components/ui/skeleton'
import { incrementalArray } from '@/utils/array'
import { typedEntriesOf } from '@/utils/object'

import { useShoppingList } from '../hooks/use-shopping-list'
import { CartItem } from './cart-item'

export const ShoppingList = () => {
  const { isLoading, shoppingListIngredients } = useShoppingList()

  return (
    <Show
      when={!isLoading()}
      fallback={
        <For each={incrementalArray({ length: 4 })}>
          {() => (
            <div class="space-y-2">
              <Skeleton class="h-6 w-32" />
              <div class="space-y-2">
                <For each={incrementalArray({ length: 3 })}>{() => <Skeleton class="h-8 w-full" />}</For>
              </div>
            </div>
          )}
        </For>
      }
    >
      <For each={typedEntriesOf(shoppingListIngredients())}>
        {([key, ingredients]) => (
          <div>
            <h2 class="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wider text-primary uppercase">
              {ingredientCategoryIcons[key]}
              {ingredientCategoryLabels[key]}
            </h2>
            <div class="overflow-hidden rounded-2xl border bg-card px-3.5">
              <For each={ingredients}>{(ingredient) => <CartItem ingredient={ingredient} />}</For>
            </div>
          </div>
        )}
      </For>
    </Show>
  )
}
