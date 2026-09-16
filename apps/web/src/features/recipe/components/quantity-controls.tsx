import { addToShoppingList, removeFromShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { MinusIcon } from '@recipe-organizer/design-system/icons/minus'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { TrashIcon } from '@recipe-organizer/design-system/icons/trash'

import { useIsInShoppingList } from '../hooks/use-is-in-shopping-list'
import { useRecipeQuantities } from '../hooks/use-recipe-quantities'

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
      <div
        className={css({
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          background: 'white/15',
          borderRadius: 'xl',
          display: 'flex',
          gap: '2.5',
          justifyContent: 'center',
          padding: '1',
          ring: '1',
          ringColor: 'white/20',
          width: 'full',
        })}
      >
        <Button onClick={decrementQuantity} disabled={quantity === 1} aria-label="Retirer un couvert" size="icon-xs" variant="media-overlay-card">
          <MinusIcon weight="bold" />
        </Button>
        <span
          className={css({
            color: 'white',
            fontSize: '13px',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 'bold',
            minWidth: '18',
            textAlign: 'center',
          })}
        >
          {quantity} couverts
        </span>
        <Button onClick={incrementQuantity} aria-label="Ajouter un couvert" size="icon-xs">
          <PlusIcon weight="bold" />
        </Button>
        <Button onClick={() => removeFromShoppingList(recipeId)} aria-label="Retirer de la liste" size="icon-xs" variant="media-overlay-card">
          <TrashIcon />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={css({
        alignItems: 'center',
        background: 'card',
        borderRadius: '2xl',
        borderWidth: '1px',
        display: 'flex',
        gap: '3',
        justifyContent: 'space-between',
        padding: '2',
        paddingLeft: '4',
      })}
    >
      <div className={css({ alignItems: 'center', display: 'flex', gap: '3' })}>
        <span className={css({ fontSize: 'sm', fontWeight: 'bold' })}>Couverts</span>
        <div className={css({ alignItems: 'center', display: 'flex', gap: '2' })}>
          <Button disabled={quantity === 1} onClick={decrementQuantity} aria-label="Retirer un couvert" size="icon-sm" variant="outline">
            <MinusIcon />
          </Button>
          <span className={css({ fontVariantNumeric: 'tabular-nums', fontWeight: 'bold', minWidth: '5', textAlign: 'center' })}>{quantity}</span>
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
