import { Button } from '@/design-system/ui/actions/button/button'
import { Card } from '@/design-system/ui/data-display/card/card'
import { authClient } from '@/lib/client/auth/auth-client'

import * as styles from './account-content.css'

interface AccountContentProps {
  readonly email?: string
}

const handleLogout = async () => {
  await authClient.signOut()
  globalThis.location.assign('/auth/login')
}

export const AccountContent = ({ email }: AccountContentProps) => (
  <div className={styles.pageContent}>
    <Card>
      <div className={styles.cardContent}>
        <div>
          <h2 className={styles.heading}>Informations du compte</h2>
          <div className={styles.accountDetails}>
            <div>
              <p className={styles.label}>Email</p>
              <p className={styles.email}>{email}</p>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <h2 className={styles.heading}>Actions</h2>
          <Button onClick={handleLogout} variant="outline">
            Se déconnecter
          </Button>
        </div>
      </div>
    </Card>
  </div>
)
