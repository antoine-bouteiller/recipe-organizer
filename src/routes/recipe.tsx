import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const RecipeLayout = () => (
  <div className="h-full max-w-5xl mx-auto relative md:p-8">
    <Card className="pt-0 relative gap-6 border-none shadow-none rounded-none md:border md:shadow-sm md:rounded-xl h-full">
      <Button asChild variant="outline" className="absolute top-4 left-4 rounded-full" size="icon">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Outlet />
    </Card>
  </div>
)

export const Route = createFileRoute('/recipe')({
  component: RecipeLayout,
})
