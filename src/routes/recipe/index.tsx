import { Button } from '@/components/ui/button'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

const RecipeList = () => {
  const { data: recipes } = useQuery(getRecipeListOptions())

  const { authUser } = Route.useRouteContext()

  return (
    <>
      <div className="md:mx-auto md:max-w-5xl">
        <div className="flex flex-col md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4 px-4 pb-2">
          {recipes?.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      {authUser && (
        <div className="flex w-full sticky bottom-16 md:bottom-4 px-4 justify-end">
          <Button render={<Link to="/recipe/new" />} size="icon" className="p-5">
            <PlusIcon className="size-4" />
          </Button>
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute('/recipe/')({
  component: RecipeList,
  validateSearch: z.object({
    search: z.boolean().optional(),
  }),
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getRecipeListOptions())
  },
})
