import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import type { Ingredient } from '@/types/ingredient'

const IngredientCatalogContext = createContext<readonly Ingredient[]>([])

/** Pages that render ingredient pickers provide their loader's ingredient list here. */
export const IngredientCatalogProvider = ({ children, ingredients }: { children: ReactNode; ingredients: readonly Ingredient[] }) => (
  <IngredientCatalogContext.Provider value={ingredients}>{children}</IngredientCatalogContext.Provider>
)

export const useIngredientCatalog = () => useContext(IngredientCatalogContext)
