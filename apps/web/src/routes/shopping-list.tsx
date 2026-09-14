import { ScreenLayout } from '@client/components/layout/screen-layout'
import { getRecipeByIdsOptions } from '@client/features/shopping-list/api/get-recipe-by-ids'
import { ResetCartButton } from '@client/features/shopping-list/component/reset-cart-button'
import { ShoppingList } from '@client/features/shopping-list/component/shopping-list'
import { getShoppingListIds } from '@client/stores/shopping-list.store'
import { createFileRoute } from '@tanstack/react-router'

const ShoppingListPage = () => (
  <ScreenLayout pageKey="/shopping-list" headerEndItem={<ResetCartButton />} title="Liste de courses">
    <div className="space-y-5">
      <ShoppingList />
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
  loader: ({ context }) => {
    const ids = getShoppingListIds()
    if (ids.length > 0) {
      void context.queryClient.query(getRecipeByIdsOptions(ids)).catch(() => undefined)
    }
  },
})
