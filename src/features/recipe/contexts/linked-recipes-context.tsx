import { createContext, type JSX, useContext } from 'solid-js'

interface LinkedRecipesContextValue {
  linkedRecipeIds: number[]
}

const LinkedRecipesContext = createContext<LinkedRecipesContextValue>()

interface LinkedRecipesProviderProps {
  children: JSX.Element
  linkedRecipeIds: number[]
}

export const LinkedRecipesProvider = (props: LinkedRecipesProviderProps) => (
  <LinkedRecipesContext.Provider value={{ linkedRecipeIds: props.linkedRecipeIds }}>{props.children}</LinkedRecipesContext.Provider>
)

export const useLinkedRecipes = () => {
  const context = useContext(LinkedRecipesContext)
  return context?.linkedRecipeIds ?? []
}
