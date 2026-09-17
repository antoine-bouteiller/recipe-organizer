import { addToShoppingList, removeFromShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { MinusIcon } from '@recipe-organizer/design-system/icons/minus'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { TrashIcon } from '@recipe-organizer/design-system/icons/trash'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

import * as styles from './quantity-controls.css'

export interface QuantityControlsProps {
  readonly recipeId: number
  readonly servings: number
  readonly variant?: 'default' | 'card'
}

export const QuantityControls = ({ recipeId, servings, variant = 'default' }: QuantityControlsProps) => {
  const isInShoppingList = useIsInShoppingList(recipeId)
  const { decrementQuantity, incrementQuantity, quantity } = useRecipeQuantities(recipeId, servings)

  if (variant === 'card') {
    if (!isInShoppingList) {
      return (
        <Button onClick={() => addToShoppingList(recipeId)}>
          <PlusIcon weight="bold" />
          Ajouter à la liste
        </Button>
      )
    }

    return (
      <div className={styles.container}>
        <Button onClick={decrementQuantity} disabled={quantity === 1} aria-label="Retirer un couvert" size="icon-xs" variant="secondary">
          <MinusIcon weight="bold" />
        </Button>
        <span className={styles.text}>{quantity} couverts</span>
        <Button onClick={incrementQuantity} aria-label="Ajouter un couvert" size="icon-xs" variant="secondary">
          <PlusIcon weight="bold" />
        </Button>
        <Button onClick={() => removeFromShoppingList(recipeId)} aria-label="Retirer de la liste" size="icon-xs" variant="secondary">
          <TrashIcon />
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container2}>
      <div className={styles.container3}>
        <span className={styles.text2}>Couverts</span>
        <div className={styles.container4}>
          <Button disabled={quantity === 1} onClick={decrementQuantity} aria-label="Retirer un couvert" size="icon-sm" variant="outline">
            <MinusIcon />
          </Button>
          <span className={styles.text3}>{quantity}</span>
          <Button onClick={incrementQuantity} aria-label="Ajouter un couvert" size="icon-sm">
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
