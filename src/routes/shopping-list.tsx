import { createFileRoute } from '@tanstack/solid-router'
import { createFileRoute } from '@tanstack/solid-router'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { ResetCartButton } from '@/features/shopping-list/component/reset-cart-button'
import { ShoppingList } from '@/features/shopping-list/component/shopping-list'

const ShoppingListPage = () => (
  <ScreenLayout pageKey="/shopping-list" headerEndItem={<ResetCartButton />} title="Liste de courses">
    <div className="space-y-5">
      <ShoppingList />
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
  ssr: 'data-only',
})
