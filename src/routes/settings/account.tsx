import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()
  const auth = useAuth()

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Compte</h1>
          <p className="text-muted-foreground text-sm">Gérez vos informations de compte</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm mt-1">{authUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <Button onClick={() => auth.signOut()} variant="destructive">
              Se déconnecter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
})
