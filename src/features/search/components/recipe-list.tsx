import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Item, ItemGroup, ItemSeparator } from '@/components/ui/item'
import { addRecentRecipe } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'

interface RecipeListProps {
  recipes: ReducedRecipe[]
}

export const RecipeList = ({ recipes }: RecipeListProps) => (
  <ItemGroup className="flex-1">
    {recipes.map((recipe, index) => (
      <Fragment key={recipe.id}>
        <Item
          title={recipe.name}
          media={<ArrowRightIcon />}
          onClick={() => addRecentRecipe(recipe.id)}
          render={<Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition />}
        />
        {index !== recipes.length - 1 && <ItemSeparator />}
      </Fragment>
    ))}
  </ItemGroup>
)
