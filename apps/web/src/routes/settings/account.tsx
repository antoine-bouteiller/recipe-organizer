import { ScreenLayout } from '@client/components/layout/screen-layout'
import { authClient } from '@client/lib/auth/auth-client'
import { resetAuthUserCache } from '@client/lib/auth/get-auth-user'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { css } from '@recipe-organizer/design-system/css'
import { createFileRoute, useRouter } from '@tanstack/react-router'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()

  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    resetAuthUserCache()
    await router.invalidate()
  }

  return (
    <ScreenLayout title="Compte" withGoBack>
      <div className={css({ padding: '6' })}>
        <Card>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
            <div>
              <h2 className={css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: '4' })}>Informations du compte</h2>
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
                <div>
                  <p className={css({ color: 'muted-foreground', fontSize: 'sm', fontWeight: 'medium' })}>Email</p>
                  <p className={css({ fontSize: 'sm', marginTop: '1' })}>{authUser?.email}</p>
                </div>
              </div>
            </div>

            <div className={css({ borderTopWidth: '1px', paddingTop: '6' })}>
              <h2 className={css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: '4' })}>Actions</h2>
              <Button onClick={handleLogout} variant="outline">
                Se déconnecter
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
})
