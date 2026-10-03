import { mobileMenuItems } from '@/components/navigation/constants'
import { TabBar } from '@/components/navigation/tabbar'
import { ScreenLayout } from '@/components/screen-layout/screen-layout'
import { SettingsContent } from '@/features/settings/client/components/settings-content'

import type { Props } from './index.server'

export default function SettingsPage({ isAdmin }: Props) {
  return (
    <ScreenLayout title="Paramètres" footer={<TabBar currentPath="/settings" items={mobileMenuItems} />}>
      <SettingsContent isAdmin={isAdmin} />
    </ScreenLayout>
  )
}
