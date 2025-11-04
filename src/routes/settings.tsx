import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link, Outlet, createFileRoute, redirect, useMatchRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const matchRoute = useMatchRoute()
  const isIngredientsPage = matchRoute({ to: '/settings/ingredients' })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <Tabs value={isIngredientsPage ? 'ingredients' : 'account'} className="w-full">
        <TabsList>
          <Link to="/settings" activeOptions={{ exact: true }}>
            <TabsTrigger value="account">Compte</TabsTrigger>
          </Link>
          <Link to="/settings/ingredients">
            <TabsTrigger value="ingredients">Ingrédients</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.authUser) {
      throw redirect({ to: '/auth/login', from: '/settings' })
    }
  },
})
