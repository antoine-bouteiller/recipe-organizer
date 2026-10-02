import { mobileMenuItems } from '@client/components/navigation/constants'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'

import ResetShoppingList from './_reset-shopping-list' with { island: 'load' }
import ShoppingList from './_shopping-list' with { island: 'load' }

export default function ShoppingListPage() {
  return (
    <ScreenLayout
      footer={<TabBar currentPath="/shopping-list" items={mobileMenuItems} />}
      headerEndItem={<ResetShoppingList />}
      title="Liste de courses"
    >
      <ShoppingList />
    </ScreenLayout>
  )
}
