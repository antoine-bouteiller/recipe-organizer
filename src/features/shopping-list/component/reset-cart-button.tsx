import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { useShoppingListStore } from '@/stores/shopping-list.store'

import '@tanstack/react-start/client-only'

export const ResetCartButton = () => {
  const resetShoppingList = useShoppingListStore((store) => store.resetShoppingList)

  return (
    <Button onClick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon className="size-4 text-primary" />
    </Button>
  )
}
