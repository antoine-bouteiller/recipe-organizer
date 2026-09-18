import { mobileMenuItems } from '@client/components/navigation/constants'
import { ResetCartButton } from '@client/features/shopping-list/component/reset-cart-button'
import { ShoppingList } from '@client/features/shopping-list/component/shopping-list'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createFileRoute } from '@tanstack/react-router'

import * as styles from './shopping-list.css'

const ShoppingListPage = () => (
  <ScreenLayout footer={<TabBar items={mobileMenuItems} />} headerEndItem={<ResetCartButton />} title="Liste de courses">
    <div className={styles.container}>
      <ShoppingList />
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
})
