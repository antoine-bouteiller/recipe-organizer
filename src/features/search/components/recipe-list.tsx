import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

import { Item } from '@/components/ui/item'
import { type ReducedRecipe } from '@/features/recipe/api/get-all'
import { useRecentRecipesStore } from '@/stores/recent-recipes.store'

interface RecipeListProps {
  recipes: ReducedRecipe[]
}

export const RecipeList = ({ recipes }: RecipeListProps) => (
  <Item.Group className="flex-1 justify-end px-4">
    {recipes.map((recipe, index) => (
      <Fragment key={recipe.id}>
        <Item
          onClick={() => useRecentRecipesStore.getState().addRecentRecipe(recipe.id)}
          render={<Link params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition />}
        >
          <Item.Content>{recipe.name}</Item.Content>
          <Item.Media>
            <ArrowRightIcon />
          </Item.Media>
        </Item>
        {index !== recipes.length - 1 && <Item.Separator />}
      </Fragment>
    ))}
  </Item.Group>
)
