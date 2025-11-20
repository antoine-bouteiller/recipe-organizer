import { ScreenLayout } from '@/components/screen-layout'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { useDebounce } from '@/hooks/use-debounce'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
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
      <div className="[--radius:9999px] fixed bottom-16 px-4 w-full left-0">
        <InputGroup className="h-10 border-none blurred-box has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 pl-2">
          <InputGroupInput
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12"
            autoFocus
          />
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})
