import { Button } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const RecipeLayout = () => (
  <div className="min-h-screen p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="ghost">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Retour aux recettes
          </Link>
        </Button>
      </div>
      <Outlet />
    </div>
  </div>
)

export const Route = createFileRoute('/_authed/recipe')({
  component: RecipeLayout,
})
