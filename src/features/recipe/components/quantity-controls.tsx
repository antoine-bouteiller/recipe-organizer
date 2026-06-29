import { MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'
import { cn } from '@/utils/cn'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

interface QuantityControlsProps {
  readonly recipeId: number
  readonly servings: number
  readonly variant?: 'default' | 'card'
  readonly className?: string
}

const withStopPropagation = (callback: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  event.stopPropagation()
  callback()
}

export const QuantityControls = ({ recipeId, servings, variant = 'default', className }: QuantityControlsProps) => {
  const isInShoppingList = useIsInShoppingList(recipeId)
  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(recipeId, servings)

  if (variant === 'card') {
    if (!isInShoppingList) {
      return (
        <Button onClick={withStopPropagation(() => addToShoppingList(recipeId))}>
          <PlusIcon weight="bold" />
          Ajouter à la liste
        </Button>
      )
    }

    return (
      <div className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white/15 p-1 ring-1 ring-white/20 backdrop-blur-md ring-inset">
        <Button
          onClick={withStopPropagation(decrementQuantity)}
          disabled={quantity === 1}
          size="icon-xs"
          variant="secondary"
          className="bg-white/12 text-white hover:bg-white/20"
        >
          <MinusIcon weight="bold" />
        </Button>
        <span className="min-w-18 text-center text-[13px] font-bold text-white">{quantity} couverts</span>
        <Button onClick={withStopPropagation(incrementQuantity)} size="icon-xs">
          <PlusIcon weight="bold" />
        </Button>
        <Button
          onClick={withStopPropagation(() => removeFromShoppingList(recipeId))}
          aria-label="Retirer de la liste"
          size="icon-xs"
          variant="secondary"
          className="bg-white/12 text-white hover:bg-white/20"
        >
          <TrashIcon />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-between gap-3 rounded-2xl border bg-card p-2 pl-4', className)}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold">Couverts</span>
        <div className="flex items-center gap-2">
          <Button disabled={quantity === 1} onClick={decrementQuantity} size="icon-sm" variant="outline">
            <MinusIcon />
          </Button>
          <span className="min-w-5 text-center font-bold">{quantity}</span>
          <Button onClick={incrementQuantity} size="icon-sm">
            <PlusIcon />
          </Button>
        </div>
      </div>
      {isInShoppingList ? (
        <Button onClick={() => removeFromShoppingList(recipeId)} variant="destructive-outline">
          <TrashIcon />
          Retirer
        </Button>
      ) : (
        <Button onClick={() => addToShoppingList(recipeId)} variant="secondary">
          <PlusIcon weight="bold" />
          Ajouter
        </Button>
      )}
    </div>
  )
}
