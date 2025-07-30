import { Button } from '@/components/ui/button'
import { getAllRecipes } from '@/features/recipe/api/get-all'
import RecipeCard from '@/features/recipe/recipe-card'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getAllRecipes(),
})

export default function Home() {
  const recipes = Route.useLoaderData()

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Mon Livre de Recettes</h1>
          <p className="mb-6 text-xl">Découvrez nos délicieuses recettes</p>
          <Button asChild>
            <Link to="/recipe/new">Ajouter une recette</Link>
          </Button>
        </header>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}
