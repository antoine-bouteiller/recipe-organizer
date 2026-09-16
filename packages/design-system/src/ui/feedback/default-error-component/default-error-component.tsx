import type React from 'react'

import { rootRecipe, headingRecipe, bodyRecipe, subheadingRecipe, detailsRecipe } from './default-error-component.css'

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
  <div className={rootRecipe()} role="alert">
    <h1 className={headingRecipe()}>Whoops!</h1>
    <div className={bodyRecipe()}>
      <h2 className={subheadingRecipe()}>Une erreur est survenue</h2>
      <p>{description}</p>
    </div>
    {details && (
      <div className={detailsRecipe()}>
        <code>{details}</code>
      </div>
    )}
    {action}
  </div>
)
