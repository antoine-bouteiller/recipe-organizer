import { ScreenLayout } from '@client/components/layout/screen-layout'
import { ResetCartButton } from '@client/features/shopping-list/component/reset-cart-button'
import { ShoppingList } from '@client/features/shopping-list/component/shopping-list'
import { createFileRoute } from '@tanstack/react-router'

import * as styles from './-shopping-list.css'

const ShoppingListPage = () => (
  <ScreenLayout pageKey="/shopping-list" headerEndItem={<ResetCartButton />} title="Liste de courses">
    <div className={styles.container}>
      <ShoppingList />
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
})
