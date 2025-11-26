import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { useDebounce } from '@/hooks/use-debounce'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

const RouteComponent = () => {
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 200)

  const { data: recipes } = useQuery(getRecipeListOptions(debouncedSearch))

  return (
    <ScreenLayout title="Rechercher">
      <div className="sticky top-0 bg-background px-4 pt-4 pb-2  z-10 flex items-center gap-4">
        <SearchInput search={search} setSearch={setSearch} autoFocus />
      </div>
      <ItemGroup className="flex-1 px-4 justify-end pb-8">
        {recipes?.map((recipe, index) => (
          <Fragment key={recipe.id}>
            <Item render={<Link to="/recipe/$id" params={{ id: recipe.id.toString() }} />}>
              <ItemContent>{recipe.name}</ItemContent>
              <ItemMedia>
                <ArrowRightIcon />
              </ItemMedia>
            </Item>
            {index !== recipes.length - 1 && <ItemSeparator />}
          </Fragment>
        ))}
      </ItemGroup>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})
