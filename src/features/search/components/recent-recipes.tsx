import { createMemo, Show } from 'solid-js'

import { RecipeList } from '@/features/search/components/recipe-list'
import { clearRecentRecipes, useRecentRecipeIds } from '@/stores/recent-recipes.store'
import { type ReducedRecipe } from '@/types/recipe'

interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipes = (props: RecentRecipesProps) => {
  const recentRecipeIds = useRecentRecipeIds()

  const recentRecipes = createMemo(() =>
    recentRecipeIds()
      .map((id) => props.recipes.find((recipe) => recipe.id === id))
      .filter((recipe): recipe is ReducedRecipe => recipe !== undefined)
  )

  return (
    <Show when={recentRecipes().length > 0} fallback={<RecipeList recipes={props.recipes} />}>
      <div class="flex flex-1 flex-col">
        <div class="flex items-center justify-between pt-2 pb-1">
          <h2 class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Recherches récentes</h2>
          <button class="text-sm font-semibold text-primary" onClick={clearRecentRecipes} type="button">
            Effacer
          </button>
        </div>
        <RecipeList recipes={recentRecipes()} />
      </div>
    </Show>
  )
}
