import { GoBackButton, ScreenLayout } from '@/design-system/ui/layout/screen-layout/screen-layout'
import { UsersManagement } from '@/features/users/client/components/users-management'

import type { Props } from './index.server'

export default function UsersPage({ users }: Props) {
  return (
    <ScreenLayout title="Utilisateurs" backButton={<GoBackButton />}>
      <UsersManagement users={users} />
    </ScreenLayout>
  )
}
