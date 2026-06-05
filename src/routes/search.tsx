import { createFileRoute } from '@tanstack/react-router'

import { getRecipeListOptions } from '@/features/recipe/api/get-all'
import { SearchPage } from '@/features/search/components/search-page'

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRecipeListOptions())
  },
})
