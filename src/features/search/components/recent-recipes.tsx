import { type ReducedRecipe } from '@/features/recipe/api/get-all'

import { RecentRecipesContent } from './recent-recipes-content'

interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipes = ({ recipes }: RecentRecipesProps) => <RecentRecipesContent recipes={recipes} />
