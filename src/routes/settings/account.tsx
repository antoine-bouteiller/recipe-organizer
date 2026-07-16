import { createFileRoute, useRouter } from '@tanstack/solid-router'

import { ScreenLayout } from '@/components/layout/screen-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { authClient } from '@/lib/auth/auth-client'

const RouteComponent = () => {
  const context = Route.useRouteContext()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    await router.invalidate()
  }

  return (
    <ScreenLayout title="Compte" withGoBack>
      <Card class="p-6">
        <div class="space-y-6">
          <div>
            <h2 class="mb-4 text-lg font-semibold">Informations du compte</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-muted-foreground">Email</p>
                <p class="mt-1 text-sm">{context().authUser?.email}</p>
              </div>
            </div>
          </div>

          <div class="border-t pt-6">
            <h2 class="mb-4 text-lg font-semibold">Actions</h2>
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
