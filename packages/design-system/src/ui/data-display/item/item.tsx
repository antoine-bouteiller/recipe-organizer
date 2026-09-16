import { cva, type RecipeVariantProps } from '@recipe-organizer/design-system/css'
import type React from 'react'

const groupRecipe = cva({ base: { display: 'flex', flexDirection: 'column' } })
const separatorRecipe = cva({ base: { backgroundColor: 'border', height: '1px', width: 'full' } })
const itemRecipe = cva({
  base: {
    _focusVisible: { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 50%, transparent)' },
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 'md',
    borderWidth: '1px',
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 'sm',
    gap: '4',
    outline: 'none',
    padding: '4',
    transitionDuration: '100ms',
    transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
    transitionTimingFunction: 'in-out',
  },
  defaultVariants: { layout: 'wrap', variant: 'default' },
  variants: {
    layout: { row: { flexWrap: 'nowrap' }, wrap: {} },
    variant: { default: { backgroundColor: 'transparent' }, outline: { borderColor: 'border' } },
  },
})
const mediaRecipe = cva({
  base: {
    '[data-slot=item]:has([data-slot=item-description]) &': { alignSelf: 'flex-start', transform: 'translateY(0.125rem)' },
    alignItems: 'center',
    display: 'flex',
    flexShrink: '0',
    gap: '2',
    justifyContent: 'center',
  },
})
const contentRecipe = cva({ base: { display: 'flex', flex: '1', flexDirection: 'column', gap: '1' } })
const titleRecipe = cva({
  base: { alignItems: 'center', display: 'flex', fontSize: 'sm', fontWeight: 'medium', gap: '2', lineHeight: 'snug', width: 'fit-content' },
})
const descriptionRecipe = cva({
  base: {
    '& > a': { _hover: { color: 'primary' }, textDecoration: 'underline', textUnderlineOffset: '4px' },
    alignItems: 'center',
    color: 'muted-foreground',
    display: 'flex',
    fontSize: 'sm',
    fontWeight: 'normal',
    gap: '1',
    lineHeight: 'normal',
    textWrap: 'balance',
  },
})
const actionsRecipe = cva({ base: { alignItems: 'center', display: 'flex', gap: '2' } })
export type ItemGroupProps = Pick<React.ComponentProps<'div'>, 'children'>
export type ItemProps = Pick<React.ComponentProps<'div'>, 'children'> &
  RecipeVariantProps<typeof itemRecipe> & { actions?: React.ReactNode; media?: React.ReactNode; title?: React.ReactNode }

export const ItemGroup = ({ children }: ItemGroupProps): React.ReactElement => (
  <div className={groupRecipe()} data-slot="item-group" role="list">
    {children}
  </div>
)
export const ItemSeparator = (): React.ReactElement => <div aria-hidden className={separatorRecipe()} data-slot="item-separator" role="separator" />
export const Item = ({ actions, children, media, title, variant, layout }: ItemProps): React.ReactElement => (
  <div className={itemRecipe({ layout, variant })} data-slot="item" data-variant={variant ?? 'default'}>
    {media !== undefined && (
      <div className={mediaRecipe()} data-slot="item-media">
        {media}
      </div>
    )}
    {(title !== undefined || children !== undefined) && (
      <div className={contentRecipe()} data-slot="item-content">
        {title !== undefined && (
          <div className={titleRecipe()} data-slot="item-title">
            {title}
          </div>
        )}
        {children !== undefined && (
          <p className={descriptionRecipe()} data-slot="item-description">
            {children}
          </p>
        )}
      </div>
    )}
    {actions !== undefined && (
      <div className={actionsRecipe()} data-slot="item-actions">
        {actions}
      </div>
    )}
  </div>
)
