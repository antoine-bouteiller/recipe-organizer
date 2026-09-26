import type { RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'

import * as styles from './item.css'

export type ItemGroupProps = Pick<React.ComponentProps<'div'>, 'children'>
export type ItemProps = Pick<React.ComponentProps<'div'>, 'children'> &
  RecipeVariants<typeof styles.item> & { actions?: React.ReactNode; media?: React.ReactNode; title?: React.ReactNode }

export const ItemGroup = ({ children }: ItemGroupProps): React.ReactElement => (
  <div className={styles.group()} data-slot="item-group" role="list">
    {children}
  </div>
)
export const ItemSeparator = (): React.ReactElement => <div aria-hidden className={styles.separator()} data-slot="item-separator" role="separator" />
export const Item = ({ actions, children, media, title, variant, layout }: ItemProps): React.ReactElement => (
  <div className={styles.item({ layout, variant })} data-slot="item" data-variant={variant ?? 'default'}>
    {media !== undefined && (
      <div className={styles.media()} data-slot="item-media">
        {media}
      </div>
    )}
    {(title !== undefined || children !== undefined) && (
      <div className={styles.content()} data-slot="item-content">
        {title !== undefined && (
          <div className={styles.title()} data-slot="item-title">
            {title}
          </div>
        )}
        {children !== undefined && (
          <p className={styles.description()} data-slot="item-description">
            {children}
          </p>
        )}
      </div>
    )}
    {actions !== undefined && (
      <div className={styles.actions()} data-slot="item-actions">
        {actions}
      </div>
    )}
  </div>
)
