import { mobileMenuItems } from '@client/components/navigation/constants'
import { ShoppingList } from '@client/features/shopping-list/component/shopping-list'
import { resetShoppingList } from '@client/stores/shopping-list.store'
import { Button } from '@recipe-organizer/design-system/button'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createFileRoute } from '@tanstack/react-router'

const ShoppingListPage = () => (
  <ScreenLayout
    footer={<TabBar items={mobileMenuItems} />}
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

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
})
