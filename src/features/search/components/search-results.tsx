import { Button } from '@/components/ui/button'
import { type ReducedRecipe } from '@/features/recipe/api/get-all'

import { RecipeList } from './recipe-list'

interface SearchResultsProps {
  recipes: ReducedRecipe[]
  onClearFilters: () => void
}

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

  return <RecipeList recipes={recipes} />
}
