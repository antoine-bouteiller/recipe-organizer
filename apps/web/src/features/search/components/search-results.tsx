import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { useIsInShoppingList } from '@client/hooks/use-is-in-shopping-list'
import { addToShoppingList } from '@client/stores/shopping-list.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'

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
    <span className={styles.text2}>
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
        <div className={styles.container2}>
          <MagnifyingGlassIcon size="xl" />
        </div>
        <p className={styles.text3}>Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container3}>
      <div className={styles.container4}>
        {recipes.length} résultat{recipes.length > 1 ? 's' : ''}
      </div>
      {recipes.map((recipe, index) => (
        <RecipeSearchCard key={recipe.id} index={index} action={<ResultAddButton recipeId={recipe.id} />} recipe={recipe} />
      ))}
    </div>
  )
}
