import { ArrowRightIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { incrementalArray } from '@/utils/array'

const SearchPending = () => (
  <ScreenLayout title="Rechercher">
    <div className="sticky top-0 z-10 flex items-center gap-4 bg-background px-4 pt-4 pb-2">
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="flex flex-col gap-2 px-4 pt-2">
      {incrementalArray({ length: 8 }).map((i) => (
        <Skeleton className="h-12 w-full" key={i} />
      ))}
    </div>
  </ScreenLayout>
)

const RouteComponent = () => {
  const [search, setSearch] = useState('')

  const { data: recipes } = useSuspenseQuery(getRecipeListOptions())

  const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <ScreenLayout title="Rechercher">
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-background px-4 pt-4 pb-2">
        <SearchInput autoFocus search={search} setSearch={setSearch} />
      </div>
      <ItemGroup className="flex-1 justify-end px-4">
        {filteredRecipes.map((recipe, index) => (
          <Fragment key={recipe.id}>
            <Item render={<Link params={{ id: recipe.id.toString() }} to="/recipe/$id" />}>
              <ItemContent>{recipe.name}</ItemContent>
              <ItemMedia>
                <ArrowRightIcon />
              </ItemMedia>
            </Item>
            {index !== filteredRecipes.length - 1 && <ItemSeparator />}
          </Fragment>
        ))}
      </ItemGroup>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
  pendingComponent: SearchPending,
})
