import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeftIcon } from '@phosphor-icons/react'

const RecipeLayout = () => (
  <div className="md:min-h-full max-w-5xl mx-auto relative md:p-8 flex flex-col">
    <Card className="pt-0 relative gap-2 md:gap-6 border-none shadow-none rounded-none md:border md:shadow-sm md:rounded-xl flex-1 flex flex-col bg-background md:bg-card">
      <Button asChild variant="outline" className="absolute top-4 left-4 rounded-full" size="icon">
        <Link to="/">
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
      </Button>
      <Outlet />
    </Card>
  </div>
)

export const Route = createFileRoute('/recipe')({
  component: RecipeLayout,
})
