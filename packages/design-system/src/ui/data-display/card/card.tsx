import type React from 'react'

import { cardRecipe, headerRecipe, titleRecipe, descriptionRecipe } from './card.css'

export type CardProps = Pick<React.ComponentProps<'div'>, 'children'> & { description?: React.ReactNode; title?: React.ReactNode }

export const Card = ({ children, description, title }: CardProps): React.ReactElement => {
  const hasHeader = title !== undefined || description !== undefined
  return (
    <div className={cardRecipe()} data-slot="card">
      {hasHeader && (
        <div className={headerRecipe()} data-slot="card-header">
          {title !== undefined && (
            <div className={titleRecipe()} data-slot="card-title">
              {title}
            </div>
          )}
          {description !== undefined && (
            <div className={descriptionRecipe()} data-slot="card-description">
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
