import { mobileMenuItems } from '@client/components/navigation/constants'
import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { RecipeListContent, RecipeListSkeleton } from '@client/features/recipe/components/recipe-list'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const searchSchema = z.object({
  search: z.boolean().optional(),
})

const RecipeListPage = () => {
  const { authUser } = Route.useRouteContext()
  const { data: recipes, isLoading } = useQuery({ ...getRecipeListOptions(), throwOnError: true })

  return (
    <ScreenLayout title="Recettes" footer={<TabBar items={mobileMenuItems} />}>
      {isLoading ? <RecipeListSkeleton /> : recipes && <RecipeListContent canCreate={Boolean(authUser)} recipes={recipes} />}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeListPage,
  validateSearch: (search) => {
    const result = searchSchema.safeParse(search)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Invalid search params')
    }
    return result.data
  },
})
