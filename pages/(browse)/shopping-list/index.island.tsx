import { mobileMenuItems } from '@/components/navigation/constants'
import { ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { TabBar } from '@/design-system/ui/navigation/tabbar/tabbar'

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
