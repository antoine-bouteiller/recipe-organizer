import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { useGetAllRecipes } from '@/features/recipe/api/get-all'
import { useSearchStore } from '@/stores/search.store'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

const RouteComponent = () => {
  const { debouncedSearch } = useSearchStore()
  const { data: recipes } = useGetAllRecipes(debouncedSearch)
  return (
    <ItemGroup className="flex-1 px-4 justify-end">
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
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})
