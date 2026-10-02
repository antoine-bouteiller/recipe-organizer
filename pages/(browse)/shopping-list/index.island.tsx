import { mobileMenuItems } from '@/components/navigation/constants'
import { TabBar } from '@/components/navigation/tabbar'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'

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
