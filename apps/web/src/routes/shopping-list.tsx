import { mobileMenuItems } from '@client/components/navigation/constants'
import { ResetCartButton } from '@client/features/shopping-list/component/reset-cart-button'
import { ShoppingList, ShoppingListContainer } from '@client/features/shopping-list/component/shopping-list'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createFileRoute } from '@tanstack/react-router'

const ShoppingListPage = () => (
  <ScreenLayout footer={<TabBar items={mobileMenuItems} />} headerEndItem={<ResetCartButton />} title="Liste de courses">
    <ShoppingListContainer>
      <ShoppingList />
    </ShoppingListContainer>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
})
