import { MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { addToShoppingList, removeFromShoppingList } from '@/stores/shopping-list.store'

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
        <Button onClick={withStopPropagation(() => addToShoppingList(recipeId))} className="h-9 w-full rounded-xl font-bold sm:h-9">
          <PlusIcon weight="bold" />
          Ajouter à la liste
        </Button>
      )
    }

    return (
      <div className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white/15 p-1 ring-1 ring-white/20 backdrop-blur-md ring-inset">
        <button
          onClick={withStopPropagation(decrementQuantity)}
          disabled={quantity === 1}
          type="button"
          className="flex h-7 w-9 items-center justify-center rounded-lg bg-white/20 text-white disabled:opacity-40"
        >
          <MinusIcon weight="bold" />
        </button>
        <span className="min-w-18 text-center text-[13px] font-bold text-white">{quantity} couverts</span>
        <button
          onClick={withStopPropagation(incrementQuantity)}
          type="button"
          className="flex h-7 w-9 items-center justify-center rounded-lg bg-primary text-white"
        >
          <PlusIcon weight="bold" />
        </button>
        <button
          onClick={withStopPropagation(() => removeFromShoppingList(recipeId))}
          type="button"
          aria-label="Retirer de la liste"
          className="flex h-7 w-9 items-center justify-center rounded-lg bg-white/12 text-white"
        >
          <TrashIcon />
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <Button disabled={quantity === 1} onClick={decrementQuantity} size="icon" variant="outline">
        <MinusIcon />
      </Button>
      <span>{quantity}</span>
      <Button onClick={incrementQuantity} size="icon" variant="outline">
        <PlusIcon />
      </Button>
      <Button onClick={() => (isInShoppingList ? removeFromShoppingList(recipeId) : addToShoppingList(recipeId))} variant="outline">
        {isInShoppingList ? 'Supprimer de la liste' : 'Ajouter à la liste'}
      </Button>
    </div>
  )
}
