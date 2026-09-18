import { AccountContent } from '@client/features/settings/components/account-content'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { authUser } = Route.useRouteContext()

  return (
    <ScreenLayout title="Compte" withGoBack>
      <AccountContent email={authUser?.email} />
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/account')({
  component: RouteComponent,
})
