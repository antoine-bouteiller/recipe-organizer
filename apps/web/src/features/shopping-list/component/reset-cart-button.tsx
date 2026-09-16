import { resetShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'

export const ResetCartButton = () => (
  <span className={css({ color: 'primary' })}>
    <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon size="sm" />
    </Button>
  </span>
)
