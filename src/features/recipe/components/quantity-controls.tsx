import { Show } from 'solid-js'
import Minus from '~icons/ph/minus'
import MinusBold from '~icons/ph/minus-bold'
import Plus from '~icons/ph/plus'
import PlusBold from '~icons/ph/plus-bold'
import Trash from '~icons/ph/trash'

import { Button } from '@/components/ui/button'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'
import { cn } from '@/utils/cn'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

interface QuantityControlsProps {
  readonly recipeId: number
  readonly servings: number
  readonly variant?: 'default' | 'card'
  readonly class?: string
}

const withStopPropagation = (callback: () => void) => (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  callback()
}

export const QuantityControls = (props: QuantityControlsProps) => {
  const isInShoppingList = useIsInShoppingList(props.recipeId)
  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(props.recipeId, props.servings)

  return (
    <Show
      when={props.variant === 'card'}
      fallback={
        <div class={cn('flex items-center justify-between gap-3 rounded-2xl border bg-card p-2 pl-4', props.class)}>
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold">Couverts</span>
            <div class="flex items-center gap-2">
              <Button disabled={quantity() === 1} onClick={decrementQuantity} size="icon-sm" variant="outline">
                <Minus />
              </Button>
              <span class="min-w-5 text-center font-bold">{quantity()}</span>
              <Button onClick={incrementQuantity} size="icon-sm">
                <Plus />
              </Button>
            </div>
          </div>
          <Show
            when={isInShoppingList()}
            fallback={
              <Button onClick={() => addToShoppingList(props.recipeId)} variant="secondary">
                <PlusBold />
                Ajouter
              </Button>
            }
          >
            <Button onClick={() => removeFromShoppingList(props.recipeId)} variant="destructive-outline">
              <Trash />
              Retirer
            </Button>
          </Show>
        </div>
      }
    >
      <Show
        when={isInShoppingList()}
        fallback={
          <Button onClick={withStopPropagation(() => addToShoppingList(props.recipeId))}>
            <PlusBold />
            Ajouter à la liste
          </Button>
        }
      >
        <div class="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white/15 p-1 ring-1 ring-white/20 backdrop-blur-md ring-inset">
          <Button
            class="bg-white/12 text-white hover:bg-white/20"
            disabled={quantity() === 1}
            onClick={withStopPropagation(decrementQuantity)}
            size="icon-xs"
            variant="secondary"
          >
            <MinusBold />
          </Button>
          <span class="min-w-18 text-center text-[13px] font-bold text-white">{quantity()} couverts</span>
          <Button onClick={withStopPropagation(incrementQuantity)} size="icon-xs">
            <PlusBold />
          </Button>
          <Button
            aria-label="Retirer de la liste"
            class="bg-white/12 text-white hover:bg-white/20"
            onClick={withStopPropagation(() => removeFromShoppingList(props.recipeId))}
            size="icon-xs"
            variant="secondary"
          >
            <Trash />
          </Button>
        </div>
      </Show>
    </Show>
  )
}
