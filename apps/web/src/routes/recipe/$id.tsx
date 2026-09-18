import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { getRecipeDetailsOptions } from '@client/features/recipe/api/get-one'
import { RecipeDetailsContent, RecipeDetailsSkeleton, RecipeManagementActions } from '@client/features/recipe/components/recipe-details'
import { NotFound } from '@recipe-organizer/design-system/not-found'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const paramsSchema = z.object({
  id: z.string().transform((str) => Number.parseInt(str, 10)),
})

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading, isSuccess } = useQuery({ ...getRecipeDetailsOptions(id), throwOnError: true })
  const { authUser } = Route.useRouteContext()
  const recipes = useQueryClient().getQueryData(getRecipeListOptions().queryKey)
  const preview = recipe ?? recipes?.find((item) => item.id === id)

  if (isSuccess && !recipe) {
    return <NotFound />
  }

  return (
    <ScreenLayout
      title={preview?.name ?? ''}
      withGoBack
      backgroundImage={preview?.image}
      headerEndItem={authUser && recipe && <RecipeManagementActions recipe={recipe} />}
    >
      {isLoading ? <RecipeDetailsSkeleton /> : recipe && <RecipeDetailsContent recipe={recipe} recipeId={id} />}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: ({ params }) => {
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Invalid id')
    }
    return result.data
  },
})
