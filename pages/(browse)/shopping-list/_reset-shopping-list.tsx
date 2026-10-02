import { Button } from '@/components/ui/actions/button/button'
import { ArrowCounterClockwiseIcon } from '@/components/ui/data-display/icons'
import { resetShoppingList } from '@/stores/shopping-list.store'

export default function ResetShoppingList() {
  return (
    <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon size="sm" />
    </Button>
  )
}
