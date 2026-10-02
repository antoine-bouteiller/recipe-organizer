import { mobileMenuItems } from '@client/components/navigation/constants'
import { SettingsContent } from '@client/features/settings/components/settings-content'
import { ScreenLayout } from '@recipe-organizer/design-system/screen-layout'
import { TabBar } from '@recipe-organizer/design-system/tabbar'

import type { Props } from './index.server'

export default function SettingsPage({ isAdmin }: Props) {
  return (
    <ScreenLayout title="Paramètres" footer={<TabBar currentPath="/settings" items={mobileMenuItems} />}>
      <SettingsContent isAdmin={isAdmin} />
    </ScreenLayout>
  )
}
