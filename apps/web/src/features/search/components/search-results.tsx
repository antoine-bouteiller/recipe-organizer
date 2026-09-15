import { useIsInShoppingList } from '@client/features/recipe/hooks/use-is-in-shopping-list'
import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { addToShoppingList } from '@client/stores/shopping-list.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'

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
    <Button onClick={() => addToShoppingList(recipeId)} size="icon" className="size-9 shrink-0 rounded-full" aria-label="Ajouter à la liste">
      <PlusIcon weight="bold" />
    </Button>
  )
}

export const SearchResults = ({ recipes, onClearFilters }: SearchResultsProps) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-accent text-primary">
          <MagnifyingGlassIcon className="size-7" />
        </div>
        <p className="text-balance text-muted-foreground">Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2.5">
      <div className="text-xs font-semibold text-muted-foreground">
        {recipes.length} résultat{recipes.length > 1 ? 's' : ''}
      </div>
      {recipes.map((recipe, index) => (
        <RecipeSearchCard key={recipe.id} index={index} action={<ResultAddButton recipeId={recipe.id} />} recipe={recipe} />
      ))}
    </div>
  )
}
