import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { resetShoppingList } from '@/stores/shopping-list.store'

export const ResetCartButton = () => (
  <Button onClick={resetShoppingList} size="icon" variant="outline">
    <ArrowCounterClockwiseIcon className="size-4 text-primary" />
  </Button>
)
