import { mobileMenuItems } from '@/components/navigation/constants'
import { ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { TabBar } from '@/design-system/ui/navigation/tabbar/tabbar'
import { SettingsContent } from '@/features/settings/client/components/settings-content'

import type { Props } from './index.server'

export default function SettingsPage({ isAdmin }: Props) {
  return (
    <ScreenLayout title="Paramètres" footer={<TabBar currentPath="/settings" items={mobileMenuItems} />}>
      <SettingsContent isAdmin={isAdmin} />
    </ScreenLayout>
  )
}
