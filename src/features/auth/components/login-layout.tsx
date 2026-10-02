import { Button } from '@recipe-organizer/design-system/button'
import { Card } from '@recipe-organizer/design-system/card'
import { ArrowLeftIcon } from '@recipe-organizer/design-system/icons'

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
          <Button asLink to="/" size="sm" variant="ghost">
            <ArrowLeftIcon size="sm" />
            Retour à l&apos;accueil
          </Button>
        </div>
      </Card>
    </div>
  </div>
)
