import type { ReducedRecipe } from '@client/types/recipe'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

const RecipeCatalogContext = createContext<readonly ReducedRecipe[]>([])

/** The recipe editor provides its loader's recipe list for linked-recipe pickers. */
export const RecipeCatalogProvider = ({ children, recipes }: { children: ReactNode; recipes: readonly ReducedRecipe[] }) => (
  <RecipeCatalogContext.Provider value={recipes}>{children}</RecipeCatalogContext.Provider>
)

export const useRecipeCatalog = () => useContext(RecipeCatalogContext)
