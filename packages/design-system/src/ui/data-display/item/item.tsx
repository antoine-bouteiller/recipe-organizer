import { type RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import { groupRecipe, separatorRecipe, itemRecipe, mediaRecipe, contentRecipe, titleRecipe, descriptionRecipe, actionsRecipe } from './item.css'

export type ItemGroupProps = Pick<React.ComponentProps<'div'>, 'children'>
export type ItemProps = Pick<React.ComponentProps<'div'>, 'children'> &
  RecipeVariants<typeof itemRecipe> & { actions?: React.ReactNode; media?: React.ReactNode; title?: React.ReactNode }

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
