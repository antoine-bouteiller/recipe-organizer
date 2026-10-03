import { GoBackButton, ScreenLayout } from '@/components/screen-layout/screen-layout'
import { AccountContent } from '@/features/settings/client/components/account-content'

import type { Props } from './index.server'

export default function AccountPage({ email }: Props) {
  return (
    <ScreenLayout title="Compte" backButton={<GoBackButton />}>
      <AccountContent email={email} />
    </ScreenLayout>
  )
}
