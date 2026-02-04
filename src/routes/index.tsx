import { BookIcon, PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { type } from 'arktype'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/components/recipe-card'
import { incrementalArray } from '@/utils/array'

const searchSchema = type({
  'search?': 'boolean',
})

const RecipeListPending = () => (
  <ScreenLayout title="Recettes">
    <div className="flex flex-col gap-8 p-4 sm:grid-cols-2 md:grid lg:grid-cols-3">
      {incrementalArray({ length: 6 }).map((i) => (
        <div className="gap-2 rounded-2xl border pt-0 pb-2" key={i}>
          <Skeleton className="h-36 w-full rounded-t-2xl" />
          <div className="px-6 pt-4 pb-2">
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  </ScreenLayout>
)

const RecipeList = () => {
  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  return (
    <ScreenLayout title="Recettes">
      <div className="flex flex-col gap-8 p-4 sm:grid-cols-2 md:grid lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Button className="fixed right-2 bottom-16 md:hidden" render={<Link to="/recipe/new" />} size="icon-xl">
        <BookIcon className="size-5" />
        <div className="absolute right-1.75 bottom-1.75 rounded-full border border-primary-foreground bg-primary p-0.5">
          <PlusIcon className="size-1.5" />
        </div>
      </Button>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeList,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getRecipeListOptions())
  },
  pendingComponent: RecipeListPending,
  validateSearch: (search) => {
    const validated = searchSchema(search)
    if (validated instanceof type.errors) {
      throw new Error(validated.summary)
    }
    return validated
  },
})
