import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Item } from '@/components/common/item'
import { ItemGroup, ItemSeparator } from '@/components/ui/item'
import { type ReducedRecipe } from '@/features/recipe/api/get-all'
import { addRecentRecipe } from '@/stores/recent-recipes.store'

interface RecipeListProps {
  recipes: ReducedRecipe[]
}

export const RecipeList = ({ recipes }: RecipeListProps) => (
  <ItemGroup className="flex-1 px-4">
    {recipes.map((recipe, index) => (
      <Fragment key={recipe.id}>
        <Item
          content={recipe.name}
          media={<ArrowRightIcon />}
          onClick={() => addRecentRecipe(recipe.id)}
          render={<Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition />}
        />
        {index !== recipes.length - 1 && <ItemSeparator />}
      </Fragment>
    ))}
  </ItemGroup>
)
