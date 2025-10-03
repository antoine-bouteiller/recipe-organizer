import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { useSearchStore } from '@/stores/search.store'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { z } from 'zod'

const Home = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { search, setSearch } = useSearchStore()

  const { data: recipes } = useQuery(getAllRecipesQueryOptions(search))

  const { authUser } = Route.useRouteContext()
  const routeSearch = Route.useSearch()

  useEffect(() => {
    if (routeSearch.search) {
      inputRef.current?.focus()
      void navigate({
        to: '/',
        replace: true,
        search: (prev) => {
          const { search: _s, ...rest } = prev
          return rest
        },
      })
    }
  }, [routeSearch.search, navigate])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="sticky top-0 z-10 bg-background flex justify-between gap-4 pb-2 pt-3 px-4 border-b border-border md:hidden">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Rechercher une recette"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={inputRef}
          />
        </div>
        {authUser && (
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link to="/recipe/new">
              <PlusIcon />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4 px-4 pb-2">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
  validateSearch: z.object({
    search: z.boolean().optional(),
  }),
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAllRecipesQueryOptions())
  },
})
