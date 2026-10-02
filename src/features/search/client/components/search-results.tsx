import { Button } from '@/components/ui/actions/button/button'
import { CheckIcon, MagnifyingGlassIcon, PlusIcon } from '@/components/ui/data-display/icons'
import { RecipeSearchCard } from '@/features/search/client/components/recipe-search-card'
import { useIsInShoppingList } from '@/hooks/use-is-in-shopping-list'
import { addToShoppingList } from '@/stores/shopping-list.store'
import type { ReducedRecipe } from '@/types/recipe'

import * as styles from './search-results.css'

export interface SearchResultsProps {
  recipes: ReducedRecipe[]
  onClearFilters: () => void
}

const ResultAddButton = ({ recipeId }: { recipeId: number }) => {
  const isInShoppingList = useIsInShoppingList(recipeId)

  if (isInShoppingList) {
    return (
      <span aria-label="Déjà dans la liste" className={styles.text}>
        <CheckIcon weight="bold" />
      </span>
    )
  }

  return (
    <span className={styles.addAction}>
      <Button aria-label="Ajouter à la liste" onClick={() => addToShoppingList(recipeId)} size="icon">
        <PlusIcon weight="bold" />
      </Button>
    </span>
  )
}

export const SearchResults = ({ recipes, onClearFilters }: SearchResultsProps) => {
  if (recipes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyStateIcon}>
          <MagnifyingGlassIcon size="xl" />
        </div>
        <p className={styles.emptyStateDescription}>Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.resultsList}>
      <div className={styles.resultCount}>
        {recipes.length} résultat{recipes.length > 1 ? 's' : ''}
      </div>
      {recipes.map((recipe, index) => (
        <RecipeSearchCard key={recipe.id} index={index} action={<ResultAddButton recipeId={recipe.id} />} recipe={recipe} />
      ))}
    </div>
  )
}
