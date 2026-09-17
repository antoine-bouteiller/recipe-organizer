import type React from 'react'

import * as styles from './default-error-component.css'

export interface DefaultErrorComponentProps {
  action?: React.ReactNode
  description?: React.ReactNode
  details?: string
}
export const DefaultErrorComponent = ({
  action,
  description = 'Une erreur est survenue lors du chargement de la page.',
  details,
}: DefaultErrorComponentProps): React.ReactElement => (
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
