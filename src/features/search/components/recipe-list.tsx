import '@tanstack/react-start/client-only'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Item, ItemContent, ItemGroup, ItemMedia, ItemSeparator } from '@/components/ui/item'
import { type ReducedRecipe } from '@/features/recipe/api/get-all'
import { useRecentRecipesStore } from '@/stores/recent-recipes.store'

interface RecipeListProps {
  recipes: ReducedRecipe[]
}

export const RecipeList = ({ recipes }: RecipeListProps) => (
  <ItemGroup className="flex-1 justify-end px-4">
    {recipes.map((recipe, index) => (
      <Fragment key={recipe.id}>
        <Item
          onClick={() => useRecentRecipesStore.getState().addRecentRecipe(recipe.id)}
          render={<Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition />}
        >
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
