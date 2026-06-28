import { CheckIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useIsInShoppingList } from '@/features/recipe/hooks/use-is-in-shopping-list'
import { CUISINE_TYPE_LABELS, MAGIMIX_LABEL, MEAL_LABELS, SPICE_LABEL, VEGETARIAN_LABEL } from '@/features/recipe/utils/constants'
import { addRecentRecipe } from '@/stores/recent-recipes.store'
import { addToShoppingList } from '@/stores/shopping-list.store'
import type { ReducedRecipe } from '@/types/recipe'


interface SearchResultsProps {
  recipes: ReducedRecipe[]
  onClearFilters: () => void
}

const ResultAddButton = ({ recipeId }: { recipeId: number }) => {
  const isInShoppingList = useIsInShoppingList(recipeId)

  if (isInShoppingList) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary" aria-label="Déjà dans la liste">
        <CheckIcon weight="bold" />
      </span>
    )
  }

  return (
    <Button
      onClick={(event) => {
        event.preventDefault()
        addToShoppingList(recipeId)
      }}
      size="icon"
      className="size-9 shrink-0 rounded-full"
      aria-label="Ajouter à la liste"
    >
      <PlusIcon weight="bold" />
    </Button>
  )
}

const SearchResultCard = ({ recipe }: { recipe: ReducedRecipe }) => (
  <Link
    className="flex items-center gap-3 rounded-2xl border bg-card p-2.5"
    onClick={() => addRecentRecipe(recipe.id)}
    params={{ id: recipe.id.toString() }}
    to="/recipe/$id"
    viewTransition
  >
    <img src={recipe.image} alt={recipe.name} className="size-15 shrink-0 rounded-xl object-cover" />
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="truncate font-bold text-foreground">{recipe.name}</span>
      <div className="flex flex-wrap gap-1.5">
        {recipe.isVegetarian && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{VEGETARIAN_LABEL}</span>
        )}
        {recipe.isMagimix && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{MAGIMIX_LABEL}</span>
        )}
        {recipe.isSpice && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{SPICE_LABEL}</span>}
        {recipe.meals.map((meal) => (
          <span key={meal} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
            {MEAL_LABELS[meal]}
          </span>
        ))}
        {recipe.cuisineTypes.map((cuisineType) => (
          <span key={cuisineType} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
            {CUISINE_TYPE_LABELS[cuisineType]}
          </span>
        ))}
      </div>
    </div>
    <ResultAddButton recipeId={recipe.id} />
  </Link>
)

export const SearchResults = ({ recipes, onClearFilters }: SearchResultsProps) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
      <div className="text-xs font-semibold text-muted-foreground">
        {recipes.length} résultat{recipes.length > 1 ? 's' : ''}
      </div>
      {recipes.map((recipe) => (
        <SearchResultCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
