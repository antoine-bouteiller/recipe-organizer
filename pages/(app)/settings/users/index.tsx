import { UsersManagement } from '@client/features/users/components/users-management'
import { GoBackButton, ScreenLayout } from '@recipe-organizer/design-system/screen-layout'

import type { Props } from './index.server'

export default function UsersPage({ users }: Props) {
  return (
    <ScreenLayout title="Utilisateurs" backButton={<GoBackButton />}>
      <UsersManagement users={users} />
    </ScreenLayout>
  )
}
