import { ScreenLayout } from '@client/components/layout/screen-layout'
import { authClient } from '@client/lib/auth/auth-client'
import { resetAuthUserCache } from '@client/lib/auth/get-auth-user'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { container, container2, heading, container3, text, text2, container4, heading2 } from './-account.css'

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
      <div className={container}>
        <Card>
          <div className={container2}>
            <div>
              <h2 className={heading}>Informations du compte</h2>
              <div className={container3}>
                <div>
                  <p className={text}>Email</p>
                  <p className={text2}>{authUser?.email}</p>
                </div>
              </div>
            </div>

            <div className={container4}>
              <h2 className={heading2}>Actions</h2>
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
