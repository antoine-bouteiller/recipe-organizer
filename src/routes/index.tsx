import { Button } from '@/components/ui/button'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { BookIcon, PlusIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import z from 'zod'

const RecipeList = () => {
  const { data: recipes } = useQuery(getRecipeListOptions())

  return (
    <>
      <div className="md:mx-auto md:max-w-5xl">
        <div className="flex flex-col md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4 px-4 pb-4">
          {recipes?.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      <Button
        render={<Link to="/recipe/new" />}
        className="blurred-box fixed right-4 bottom-16 text-primary size-12 md:hidden rounded-full hover:text-primary"
        variant="ghost"
        size="icon"
      >
        <BookIcon className="size-5" />
        <div className="absolute bottom-2 right-2 p-0.5 border border-primary bg-white rounded-full">
          <PlusIcon className="size-1.5" />
        </div>
      </Button>
    </>
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
