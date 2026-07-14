import { Link } from '@tanstack/solid-router'
import { ArrowRight } from 'phosphor-solid'
import { For, Show } from 'solid-js'

import { Item, ItemGroup, ItemSeparator } from '@/components/ui/item'
import { addRecentRecipe } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'

interface RecipeListProps {
  recipes: ReducedRecipe[]
}

export const RecipeList = (props: RecipeListProps) => (
  <ItemGroup class="flex-1">
    <For each={props.recipes}>
      {(recipe, index) => (
        <>
          <Link onClick={() => addRecentRecipe(recipe.id)} params={{ id: recipe.id.toString() }} to="/recipe/$id" viewTransition>
            <Item media={<ArrowRight />} title={recipe.name} />
          </Link>
          <Show when={index() !== props.recipes.length - 1}>
            <ItemSeparator />
          </Show>
        </>
      )}
    </For>
  </ItemGroup>
)
