import { type ReducedRecipe } from '@/types/recipe'

import { RecentRecipesContent } from './recent-recipes-content'

interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipes = ({ recipes }: RecentRecipesProps) => <RecentRecipesContent recipes={recipes} />
