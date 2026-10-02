import { resetShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons'

export default function ResetShoppingList() {
  return (
    <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon size="sm" />
    </Button>
  )
}
