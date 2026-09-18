import { authClient } from '@client/lib/auth/auth-client'
import { resetAuthUserCache } from '@client/lib/auth/get-auth-user'
import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { useRouter } from '@tanstack/react-router'

import * as styles from './account-content.css'

interface AccountContentProps {
  readonly email?: string
}

export const AccountContent = ({ email }: AccountContentProps) => {
  const router = useRouter()
  const handleLogout = async () => {
    await authClient.signOut()
    resetAuthUserCache()
    await router.invalidate()
  }

  return (
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
}
