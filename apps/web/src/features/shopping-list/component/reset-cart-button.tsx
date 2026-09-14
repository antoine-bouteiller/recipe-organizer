import { ArrowCounterClockwiseIcon } from '@client/components/icons/arrow-counter-clockwise'
import { Button } from '@client/components/ui/button'
import { resetShoppingList } from '@client/stores/shopping-list.store'

export const ResetCartButton = () => (
  <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
    <ArrowCounterClockwiseIcon className="size-4 text-primary" />
  </Button>
)
