import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { logout } from '@/features/auth/api/logout'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()

  const router = useRouter()

  const signout = useServerFn(logout)

  const handleLogout = async () => {
    await signout()
    await router.invalidate()
  }

  return (
    <ScreenLayout title="Compte" withGoBack>
      <Card className="p-6 m-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informations du compte</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm mt-1">{authUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <Button onClick={handleLogout} variant="outline">
              Se déconnecter
            </Button>
          </div>
        </div>
      </Card>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
})
