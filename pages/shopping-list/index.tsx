import { mobileMenuItems } from '@/components/navigation/constants'
import { TabBar } from '@/components/navigation/tabbar'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'
import { Button } from '@/components/ui/actions/button/button'
import { ArrowCounterClockwiseIcon } from '@/components/ui/data-display/icons'
import { ShoppingList } from '@/features/shopping-list/client/component/shopping-list'
import { resetShoppingList } from '@/stores/shopping-list.store'

export default function ShoppingListPage() {
  return (
    <ScreenLayout
      footer={<TabBar currentPath="/shopping-list" items={mobileMenuItems} />}
      headerEndItem={
        <Button aria-label="Vider la liste" onClick={resetShoppingList} size="icon" variant="outline">
          <ArrowCounterClockwiseIcon size="sm" />
        </Button>
      }
      title="Liste de courses"
    >
      <ShoppingList />
    </ScreenLayout>
  )
}
