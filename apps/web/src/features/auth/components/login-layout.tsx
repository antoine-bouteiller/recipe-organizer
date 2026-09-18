import { Button } from '@recipe-organizer/design-system/button'
import { ArrowLeftIcon } from '@recipe-organizer/design-system/icons/arrow-left'
import { Link } from '@tanstack/react-router'
import { type ReactNode } from 'react'

import * as styles from './login-layout.css'

export const LoginLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.container}>
    <div className={styles.container2}>{children}</div>
  </div>
)

export const GoogleSignInButton = ({ onSignIn }: { onSignIn: () => void }) => (
  <div className={styles.container3}>
    <Button onClick={onSignIn} variant="outline" width="full">
      <img alt="Google" className={styles.image} src="/google.svg" /> Connexion avec Google
    </Button>
  </div>
)

export const LoginBackLink = () => (
  <div className={styles.container4}>
    <Button render={<Link to="/" />} size="sm" variant="ghost">
      <ArrowLeftIcon size="sm" />
      Retour à l&apos;accueil
    </Button>
  </div>
)
