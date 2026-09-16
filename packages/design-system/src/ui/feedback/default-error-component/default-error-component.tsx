import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const rootRecipe = cva({
  base: {
    alignItems: 'center',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: '6',
    justifyContent: 'center',
    minWidth: '0',
    padding: '4',
  },
})
const headingRecipe = cva({ base: { fontSize: '5xl', fontWeight: 'semibold' } })
const bodyRecipe = cva({ base: { display: 'flex', flexDirection: 'column', gap: '2', textAlign: 'center' } })
const subheadingRecipe = cva({ base: { fontSize: '3xl', fontWeight: 'semibold' } })
const detailsRecipe = cva({
  base: { borderColor: 'destructive', borderRadius: 'sm', borderWidth: '1px', color: 'destructive', fontSize: 'sm', padding: '1' },
})
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
