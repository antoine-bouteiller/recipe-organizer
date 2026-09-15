import { resetShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'

export const ResetCartButton = () => (
  <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
    <ArrowCounterClockwiseIcon className="size-4 text-primary" />
  </Button>
)
