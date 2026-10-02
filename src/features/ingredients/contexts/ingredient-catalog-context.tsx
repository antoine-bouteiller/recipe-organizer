import type { Ingredient } from '@client/types/ingredient'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

const IngredientCatalogContext = createContext<readonly Ingredient[]>([])

/** Pages that render ingredient pickers provide their loader's ingredient list here. */
export const IngredientCatalogProvider = ({ children, ingredients }: { children: ReactNode; ingredients: readonly Ingredient[] }) => (
  <IngredientCatalogContext.Provider value={ingredients}>{children}</IngredientCatalogContext.Provider>
)

export const useIngredientCatalog = () => useContext(IngredientCatalogContext)
