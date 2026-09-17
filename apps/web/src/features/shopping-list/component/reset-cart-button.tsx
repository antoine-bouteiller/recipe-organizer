import { resetShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'

import * as styles from './reset-cart-button.css'

export const ResetCartButton = () => (
  <span className={styles.text}>
    <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon size="sm" />
    </Button>
  </span>
)
