import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const cardRecipe = cva({
  base: {
    _dark: { backgroundClip: 'border-box' },
    backgroundClip: 'padding-box',
    backgroundColor: 'card',
    borderRadius: '2xl',
    borderWidth: '1px',
    color: 'card-foreground',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    shadow: 'xs',
  },
})
const headerRecipe = cva({
  base: { alignItems: 'start', display: 'grid', gap: '1.5', gridAutoRows: 'min-content', gridTemplateRows: 'auto auto', padding: '6' },
})
const titleRecipe = cva({ base: { fontSize: 'lg', fontWeight: 'semibold', lineHeight: 'none' } })
const descriptionRecipe = cva({ base: { color: 'muted-foreground', fontSize: 'sm' } })

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
