import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import { useSearchStore } from '@/stores/search.store'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

const RouteComponent = () => {
  const { search, setSearch, debouncedSearch } = useSearchStore()
  const { data: recipes } = useQuery(getAllRecipesQueryOptions(debouncedSearch))
  return (
    <div className="flex flex-col justify-end h-full">
      <ScrollArea className="px-4">
        {recipes?.map((recipe, index) => (
          <Fragment key={recipe.id}>
            <Link
              to="/recipe/$id"
              params={{ id: recipe.id.toString() }}
              className="w-full justify-between flex py-4 items-center px-4"
            >
              {recipe.name}
              <ArrowRightIcon />
            </Link>
            {index !== recipes.length - 1 && <Separator />}
          </Fragment>
        ))}
      </ScrollArea>
      <div className="px-4 pb-1 pt-2 relative">
        <div className="relative">
          <Input
            placeholder="Rechercher une recette"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />

          <MagnifyingGlassIcon className="absolute top-1/2 left-4 -translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})
