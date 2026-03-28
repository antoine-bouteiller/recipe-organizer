import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import '@tanstack/react-start/client-only'
import { Button } from '@/components/ui/button'
import { useShoppingListStore } from '@/stores/shopping-list.store'

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
  const addToShoppingList = useShoppingListStore((state) => state.addToShoppingList)
  const removeFromShoppingList = useShoppingListStore((state) => state.removeFromShoppingList)

  const wrap = variant === 'card' ? withStopPropagation : (cb: () => void) => cb

  if (variant === 'card' && !isInShoppingList) {
    return (
      <Button onClick={withStopPropagation(() => addToShoppingList(recipeId))} variant="outline" className="w-full">
        Ajouter à la liste de courses
      </Button>
    )
  }

  return (
    <div className={className}>
      <Button disabled={quantity === 1} onClick={wrap(decrementQuantity)} size="icon" variant="outline">
        <MinusIcon />
      </Button>
      <span className={variant === 'card' ? 'text-white' : undefined}>{quantity}</span>
      <Button onClick={wrap(incrementQuantity)} size="icon" variant="outline">
        <PlusIcon />
      </Button>
      <Button onClick={wrap(() => (isInShoppingList ? removeFromShoppingList(recipeId) : addToShoppingList(recipeId)))} variant="outline">
        {isInShoppingList ? 'Supprimer de la liste' : 'Ajouter à la liste'}
      </Button>
    </div>
  )
}
