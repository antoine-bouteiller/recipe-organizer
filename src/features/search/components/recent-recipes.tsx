import { ClientOnly } from '@tanstack/react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { type ReducedRecipe } from '@/features/recipe/api/get-all'

import { RecentRecipesContent } from './recent-recipes-content'

interface RecentRecipesProps {
  recipes: ReducedRecipe[]
}

export const RecentRecipes = ({ recipes }: RecentRecipesProps) => (
  <ClientOnly fallback={<Skeleton className="mx-4 h-40 rounded-md" />}>
    <RecentRecipesContent recipes={recipes} />
  </ClientOnly>
)
