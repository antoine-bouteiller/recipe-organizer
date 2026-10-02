import { AccountContent } from '@client/features/settings/components/account-content'
import { GoBackButton, ScreenLayout } from '@recipe-organizer/design-system/screen-layout'

import type { Props } from './index.server'

export default function AccountPage({ email }: Props) {
  return (
    <ScreenLayout title="Compte" backButton={<GoBackButton />}>
      <AccountContent email={email} />
    </ScreenLayout>
  )
}
