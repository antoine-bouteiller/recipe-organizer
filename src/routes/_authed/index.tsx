import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon, SearchIcon } from 'lucide-react'

export const Route = createFileRoute('/_authed/')({
  component: Home,
  loader: async ({ context }) =>
    await context.queryClient.prefetchQuery(getAllRecipesQueryOptions()),
})

export default function Home() {
  const { data: recipes } = useQuery(getAllRecipesQueryOptions())

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Recettes</h1>
        </header>
        <div className="flex justify-between gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input placeholder="Rechercher une recette" className="pl-8" />
          </div>
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link to="/recipe/new">
              <PlusIcon />
            </Link>
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes?.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}
