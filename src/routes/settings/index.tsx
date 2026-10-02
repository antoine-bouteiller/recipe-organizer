import { mobileMenuItems } from '@client/components/navigation/constants'
import { SettingsContent } from '@client/features/settings/components/settings-content'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'
import { createFileRoute } from '@tanstack/react-router'

const RouteComponent = () => {
  const { isAdmin } = Route.useRouteContext()

  return (
    <ScreenLayout title="Paramètres" footer={<TabBar items={mobileMenuItems} />}>
      <SettingsContent isAdmin={isAdmin} />
    </ScreenLayout>
  )
}

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
})
