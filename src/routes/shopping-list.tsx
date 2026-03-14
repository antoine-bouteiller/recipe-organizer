import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { ResetCartButton } from '@/features/shopping-list/component/reset-cart-button'
import { ShoppingList } from '@/features/shopping-list/component/shopping-list'
import { incrementalArray } from '@/utils/array'

const ShoppingListPending = () =>
  incrementalArray({ length: 4 }).map((index) => (
    <div className="space-y-2" key={index}>
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        {incrementalArray({ length: 3 }).map((innerIndex) => (
          <Skeleton className="h-8 w-full" key={innerIndex} />
        ))}
      </div>
    </div>
  ))

const ShoppingListPage = () => (
  <ScreenLayout
    headerEndItem={
      <ClientOnly>
        <ResetCartButton />
      </ClientOnly>
    }
    title="Liste de courses"
  >
    <div className="space-y-4 p-8">
      <ClientOnly fallback={<ShoppingListPending />}>
        <Suspense fallback={<ShoppingListPending />}>
          <ShoppingList />
        </Suspense>
      </ClientOnly>
    </div>
  </ScreenLayout>
)

export const Route = createFileRoute('/shopping-list')({
  component: ShoppingListPage,
})
