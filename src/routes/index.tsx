import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/components/recipe-card'
import { BookIcon, PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

const RecipeList = () => {
  const { data: recipes } = useQuery(getRecipeListOptions())

  return (
    <ScreenLayout title="Recettes">
      <div className="flex flex-col md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3 p-4">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Button
        render={<Link to="/recipe/new" />}
        className="fixed right-2 bottom-16 size-12 md:hidden rounded-full hover:text-primary"
        size="icon"
      >
        <BookIcon className="size-5" />
        <div className="absolute bottom-3 right-3 p-0.5 border rounded-full bg-primary border-primary-foreground">
          <PlusIcon className="size-1.5" />
        </div>
      </Button>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/')({
  component: RecipeList,
  validateSearch: z.object({
    search: z.boolean().optional(),
  }),
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getRecipeListOptions())
  },
})
