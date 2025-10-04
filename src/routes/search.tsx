import { getAllRecipesQueryOptions } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { useSearchStore } from '@/stores/search.store'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { search } = useSearchStore()
  const { data: recipes } = useQuery(getAllRecipesQueryOptions(search))
  return (
    <div>
      <div className="flex flex-col md:grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4 px-4 pb-2">
        {recipes?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})
