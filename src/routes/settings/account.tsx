import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Card } from '@/components/common/card'
import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/auth-client'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()

  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    await router.invalidate()
  }

  return (
    <ScreenLayout title="Compte" withGoBack>
      <Card className="m-4 p-6">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Informations du compte</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="mt-1 text-sm">{authUser?.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="mb-4 text-lg font-semibold">Actions</h2>
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
