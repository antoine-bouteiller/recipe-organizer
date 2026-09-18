import { Button } from '@recipe-organizer/design-system/button'
import { Link, type ErrorComponentProps } from '@tanstack/react-router'
import type React from 'react'

import * as styles from './default-error-component.css'

export interface DefaultErrorComponentProps extends Partial<Pick<ErrorComponentProps, 'error'>> {
  action?: React.ReactNode
  description?: React.ReactNode
  details?: string
}

const defaultAction = (
  <Button render={<Link to="/" />} size="lg">
    Retour à la page d'accueil
  </Button>
)

export const DefaultErrorComponent = ({
  action = defaultAction,
  description = "Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.",
  details: suppliedDetails,
  error,
}: DefaultErrorComponentProps): React.ReactElement => {
  const details = suppliedDetails ?? (import.meta.env.DEV && error instanceof Error ? error.message : undefined)

  return (
    <div className={styles.root()} role="alert">
      <h1 className={styles.heading()}>Whoops!</h1>
      <div className={styles.body()}>
        <h2 className={styles.subheading()}>Une erreur est survenue</h2>
        <p>{description}</p>
      </div>
      {details && (
        <div className={styles.details()}>
          <code>{details}</code>
        </div>
      )}
      {action}
    </div>
  )
}
