import { getIngredientListOptions } from '@client/features/ingredients/api/get-all'
import { IngredientsManagement } from '@client/features/ingredients/components/ingredients-management'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { isAdmin } = Route.useRouteContext()

  return (
    <ScreenLayout title="Ingrédients" withGoBack>
      <IngredientsManagement isAdmin={isAdmin} />
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.query({ ...getIngredientListOptions(), staleTime: 'static' }),
})
