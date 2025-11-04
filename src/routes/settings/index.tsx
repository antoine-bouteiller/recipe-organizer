import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()
  const auth = useAuth()

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Informations du compte</h2>
          <p className="text-sm text-muted-foreground mt-2">{authUser?.email}</p>
        </div>

        <div className="pt-4">
          <Button onClick={() => auth.signOut()} variant="destructive">
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})
