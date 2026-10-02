import type { RecipeVariants } from '@vanilla-extract/recipes'
import { Link } from '@void/react'
import type React from 'react'
import type { ComponentProps } from 'react'

import * as styles from './button.css'

export type ButtonProps = Pick<ComponentProps<'button'>, 'aria-label' | 'children' | 'disabled' | 'type'> &
  RecipeVariants<typeof styles.button> &
  (
    | ({ asLink: true; onClick?: never } & Pick<ComponentProps<typeof Link>, 'href' | 'viewTransition'>)
    | ({ asLink?: false; href?: never; viewTransition?: never } & Pick<
        ComponentProps<'button'>,
        'aria-expanded' | 'aria-haspopup' | 'onClick' | 'onPointerDown' | 'ref'
      >)
  )

export const Button = (props: ButtonProps): React.ReactElement => {
  if (props.asLink) {
    const { align, asLink: _asLink, size, variant, width, ...linkProps } = props
    return <Link {...linkProps} className={styles.button({ align, size, variant, width })} />
  }

  const { align, asLink: _asLink, size, variant, width, ...buttonProps } = props
  return <button {...buttonProps} className={styles.button({ align, size, variant, width })} />
}
