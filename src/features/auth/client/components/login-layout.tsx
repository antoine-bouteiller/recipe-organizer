import { Button } from '@/design-system/ui/actions/button/button'
import { Card } from '@/design-system/ui/data-display/card/card'
import { ArrowLeftIcon } from '@/design-system/ui/data-display/icons'

import * as styles from './login-layout.css'

export const LoginLayout = ({ error, onSignIn }: { error?: string; onSignIn: () => void }) => (
  <div className={styles.container}>
    <div className={styles.formContainer}>
      <Card description="Connectez-vous pour accéder à vos recettes" title="Connexion">
        <div className={styles.signInButtonContainer}>
          {error && <p className={styles.error}>{error}</p>}
          <Button onClick={onSignIn} variant="outline" width="full">
            <img alt="Google" className={styles.image} src="/google.svg" /> Connexion avec Google
          </Button>
        </div>
        <div className={styles.backLinkContainer}>
          <Button asLink href="/" size="sm" variant="ghost">
            <ArrowLeftIcon size="sm" />
            Retour à l&apos;accueil
          </Button>
        </div>
      </Card>
    </div>
  </div>
)
