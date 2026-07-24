import { BookIcon, PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as v from 'valibot'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/components/recipe-card'
import { incrementalArray } from '@/utils/array'

const searchSchema = v.object({
  search: v.optional(v.boolean()),
})

const RecipeListSkeleton = () => (
  <ScreenLayout title="Recettes" pageKey="/">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {incrementalArray({ length: 6 }).map((index) => (
        <Skeleton className="h-60 rounded-[28px]" key={index} />
      ))}
    </div>
  </ScreenLayout>
)

const RecipeList = () => {
  const { authUser } = Route.useRouteContext()
  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const visibleRecipes = recipes.filter((recipe) => !recipe.isSpice)

  return (
    <ScreenLayout title="Recettes" pageKey="/">
      {visibleRecipes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <BookIcon className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">Aucune recette</p>
          {authUser && (
            <Button render={<Link to="/recipe/new" viewTransition />}>
              <PlusIcon className="size-4" />
              Ajouter une recette
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visibleRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      )}
      {authUser && (
        <Button
          aria-label="Ajouter une recette"
          className="fixed right-2 bottom-16 md:hidden"
          render={<Link to="/recipe/new" viewTransition />}
          size="icon-xl"
        >
          <PlusIcon className="size-6" />
        </Button>
      )}
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeList,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
  pendingComponent: RecipeListSkeleton,
  ssr: 'data-only',
  validateSearch: (search) => {
    const result = v.safeParse(searchSchema, search)
    if (!result.success) {
      throw new Error(result.issues[0]?.message ?? 'Invalid search params')
    }
    return result.output
  },
})
