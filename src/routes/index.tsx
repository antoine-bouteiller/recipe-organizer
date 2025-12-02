import { BookIcon, PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/components/recipe-card'

const RecipeList = () => {
  const { data: recipes } = useQuery(getRecipeListOptions())

  return (
    <ScreenLayout title="Recettes">
      <div
        className={`
          flex flex-col gap-8 p-4
          sm:grid-cols-2
          md:grid
          lg:grid-cols-3
        `}
      >
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Button
        className={`
          fixed right-2 bottom-16
          md:hidden
        `}
        render={<Link to="/recipe/new" />}
        size="icon-xl"
      >
        <BookIcon className="size-5" />
        <div
          className={`
            absolute right-1.75 bottom-1.75 rounded-full border
            border-primary-foreground bg-primary p-0.5
          `}
        >
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
  validateSearch: z.object({
    search: z.boolean().optional(),
  }),
})
