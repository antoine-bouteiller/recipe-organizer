import { ArrowCounterClockwise } from 'phosphor-solid'

import { Button } from '@/components/ui/button'
import { resetShoppingList } from '@/stores/shopping-list.store'

export const ResetCartButton = () => (
  <Button onClick={resetShoppingList} size="icon" variant="outline">
    <ArrowCounterClockwise class="size-4 text-primary" />
  </Button>
)
