import type React from 'react'

import * as styles from './card.css'

export type CardProps = Pick<React.ComponentProps<'div'>, 'children'> & { description?: React.ReactNode; title?: React.ReactNode }

export const Card = ({ children, description, title }: CardProps): React.ReactElement => {
  const hasHeader = title !== undefined || description !== undefined
  return (
    <div className={styles.card()} data-slot="card">
      {hasHeader && (
        <div className={styles.header()} data-slot="card-header">
          {title !== undefined && (
            <div className={styles.title()} data-slot="card-title">
              {title}
            </div>
          )}
          {description !== undefined && (
            <div className={styles.description()} data-slot="card-description">
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
