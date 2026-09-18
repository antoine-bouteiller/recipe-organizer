import { getRecipeListOptions } from '@client/features/recipe/api/get-all'
import { getRecipeDetailsOptions } from '@client/features/recipe/api/get-one'
import { RecipeDetailsContent, RecipeDetailsSkeleton, RecipeManagementActions } from '@client/features/recipe/components/recipe-details'
import { RecipeLoadingSurface } from '@client/features/recipe/components/recipe-loading-surface'
import { NotFound } from '@recipe-organizer/design-system/not-found'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { Spinner } from '@recipe-organizer/design-system/spinner'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as z from 'zod'

const paramsSchema = z.object({
  id: z.string().transform((str) => Number.parseInt(str, 10)),
})

const RecipeDetailsPending = () => {
  const { id } = Route.useParams()
  const recipes = useQueryClient().getQueryData(getRecipeListOptions().queryKey)
  const recipe = recipes?.find((item) => item.id === Number(id))

  return (
    <ScreenLayout title={recipe?.name ?? ''} withGoBack backgroundImage={recipe?.image}>
      <RecipeDetailsSkeleton />
    </ScreenLayout>
  )
}

const RecipePage = () => {
  const { id } = Route.useLoaderData()
  const { data: recipe, isLoading } = useSuspenseQuery(getRecipeDetailsOptions(id))
  const { authUser } = Route.useRouteContext()

  if (isLoading) {
    return (
      <RecipeLoadingSurface>
        <Spinner />
      </RecipeLoadingSurface>
    )
  }
  if (!recipe) {
    return <NotFound />
  }

  return (
    <ScreenLayout
      title={recipe.name}
      withGoBack
      backgroundImage={recipe.image}
      headerEndItem={authUser && <RecipeManagementActions recipe={recipe} />}
    >
      <RecipeDetailsContent recipe={recipe} recipeId={id} />
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
  loader: async ({ context, params }) => {
    const result = paramsSchema.safeParse(params)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? 'Invalid id')
    }
    const { id } = result.data
    await context.queryClient.query({ ...getRecipeDetailsOptions(id), staleTime: 'static' })
    return { id }
  },
  pendingComponent: RecipeDetailsPending,
})
