import { Link } from '@tanstack/solid-router'
import { For, Show } from 'solid-js'
import Check from '~icons/ph/check-bold'
import Plus from '~icons/ph/plus-bold'

import { Button } from '@/components/ui/button'
import { useIsInShoppingList } from '@/features/recipe/hooks/use-is-in-shopping-list'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/utils/constants'
import { addRecentRecipe } from '@/stores/recent-recipes.store'
import { addToShoppingList } from '@/stores/shopping-list.store'
import { type ReducedRecipe } from '@/types/recipe'

interface SearchResultsProps {
  recipes: ReducedRecipe[]
  onClearFilters: () => void
}

const ResultAddButton = (props: { recipeId: number }) => {
  const isInShoppingList = useIsInShoppingList(props.recipeId)

  return (
    <Show
      when={isInShoppingList()}
      fallback={
        <Button
          aria-label="Ajouter à la liste"
          class="size-9 shrink-0 rounded-full"
          onClick={(event) => {
            event.preventDefault()
            addToShoppingList(props.recipeId)
          }}
          size="icon"
        >
          <Plus />
        </Button>
      }
    >
      <span aria-label="Déjà dans la liste" class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Check />
      </span>
    </Show>
  )
}

const Tag = (props: { children: string }) => (
  <span class="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{props.children}</span>
)

const SearchResultCard = (props: { recipe: ReducedRecipe }) => (
  <Link
    class="flex items-center gap-3 rounded-2xl border bg-card p-2.5"
    onClick={() => addRecentRecipe(props.recipe.id)}
    params={{ id: props.recipe.id.toString() }}
    to="/recipe/$id"
    viewTransition
  >
    <img alt={props.recipe.name} class="size-15 shrink-0 rounded-xl object-cover" src={props.recipe.image} />
    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
      <span class="truncate font-bold text-foreground">{props.recipe.name}</span>
      <div class="flex flex-wrap gap-1.5">
        <Show when={props.recipe.isVegetarian}>
          <Tag>{VEGETARIAN_LABEL}</Tag>
        </Show>
        <Show when={props.recipe.isMagimix}>
          <Tag>{MAGIMIX_LABEL}</Tag>
        </Show>
        <Show when={props.recipe.isSpice}>
          <Tag>{SPICE_LABEL}</Tag>
        </Show>
        <For each={props.recipe.meals}>{(meal) => <Tag>{MEAL_LABELS[meal]}</Tag>}</For>
        <For each={props.recipe.cuisineTypes}>{(cuisineType) => <Tag>{CUISINE_TYPE_LABELS[cuisineType]}</Tag>}</For>
      </div>
    </div>
    <ResultAddButton recipeId={props.recipe.id} />
  </Link>
)

export const SearchResults = (props: SearchResultsProps) => (
  <Show
    when={props.recipes.length > 0}
    fallback={
      <div class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p class="text-muted-foreground">Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={props.onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    }
  >
    <div class="flex flex-1 flex-col gap-2.5">
      <div class="text-xs font-semibold text-muted-foreground">
        {props.recipes.length} résultat{props.recipes.length > 1 ? 's' : ''}
      </div>
      <For each={props.recipes}>{(recipe) => <SearchResultCard recipe={recipe} />}</For>
    </div>
  </Show>
)
