import { useIsInShoppingList } from '@client/features/recipe/hooks/use-is-in-shopping-list'
import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { addToShoppingList } from '@client/stores/shopping-list.store'
import { type ReducedRecipe } from '@client/types/recipe'
import { Button } from '@recipe-organizer/design-system/button'
import { css } from '@recipe-organizer/design-system/css'
import { CheckIcon } from '@recipe-organizer/design-system/icons/check'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'

export interface SearchResultsProps {
  recipes: ReducedRecipe[]
  onClearFilters: () => void
}

const ResultAddButton = ({ recipeId }: { recipeId: number }) => {
  const isInShoppingList = useIsInShoppingList(recipeId)

  if (isInShoppingList) {
    return (
      <span
        aria-label="Déjà dans la liste"
        className={css({
          alignItems: 'center',
          background: 'accent',
          borderRadius: 'full',
          color: 'primary',
          display: 'flex',
          flexShrink: '0',
          height: '9',
          justifyContent: 'center',
          width: '9',
        })}
      >
        <CheckIcon weight="bold" />
      </span>
    )
  }

  return (
    <span className={css({ '--owner-icon-size': '1rem', flexShrink: '0' })}>
      <Button aria-label="Ajouter à la liste" onClick={() => addToShoppingList(recipeId)} size="icon">
        <PlusIcon weight="bold" />
      </Button>
    </span>
  )
}

export const SearchResults = ({ recipes, onClearFilters }: SearchResultsProps) => {
  if (recipes.length === 0) {
    return (
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
          gap: '4',
          justifyContent: 'center',
          padding: '8',
          textAlign: 'center',
        })}
      >
        <div
          className={css({
            alignItems: 'center',
            background: 'accent',
            borderRadius: 'full',
            color: 'primary',
            display: 'flex',
            height: '16',
            justifyContent: 'center',
            width: '16',
          })}
        >
          <MagnifyingGlassIcon size="xl" />
        </div>
        <p className={css({ color: 'muted-foreground', textWrap: 'balance' })}>Aucune recette ne correspond à votre recherche.</p>
        <Button onClick={onClearFilters} variant="outline">
          Effacer les filtres
        </Button>
      </div>
    )
  }

  return (
    <div className={css({ display: 'flex', flex: '1', flexDirection: 'column', gap: '2.5' })}>
      <div className={css({ color: 'muted-foreground', fontSize: 'xs', fontWeight: 'semibold' })}>
        {recipes.length} résultat{recipes.length > 1 ? 's' : ''}
      </div>
      {recipes.map((recipe, index) => (
        <RecipeSearchCard key={recipe.id} index={index} action={<ResultAddButton recipeId={recipe.id} />} recipe={recipe} />
      ))}
    </div>
  )
}
