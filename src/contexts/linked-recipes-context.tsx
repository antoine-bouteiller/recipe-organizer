import { createContext, type ReactNode, useContext } from 'react'

interface LinkedRecipesContextValue {
  linkedRecipeIds: number[]
}

const LinkedRecipesContext = createContext<LinkedRecipesContextValue | undefined>(undefined)

interface LinkedRecipesProviderProps {
  children: ReactNode
  linkedRecipeIds: number[]
}

export const LinkedRecipesProvider = ({ children, linkedRecipeIds }: LinkedRecipesProviderProps) => (
  <LinkedRecipesContext.Provider value={{ linkedRecipeIds }}>{children}</LinkedRecipesContext.Provider>
)

export const useLinkedRecipes = () => {
  const context = useContext(LinkedRecipesContext)
  return context?.linkedRecipeIds ?? []
}
