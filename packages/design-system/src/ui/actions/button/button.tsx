import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { RecipeVariants } from '@vanilla-extract/recipes'
import type React from 'react'
import type { ComponentProps } from 'react'

import * as styles from './button.css'

export type ButtonProps = Pick<ComponentProps<'button'>, 'aria-label' | 'children' | 'disabled' | 'type'> &
  RecipeVariants<typeof styles.button> &
  (
    | ({ asLink: true; onClick?: never } & Pick<LinkProps, 'to' | 'viewTransition' | 'params'>)
    | ({ asLink?: false; to?: never; viewTransition?: never; params?: never } & Pick<ComponentProps<'button'>, 'onClick'>)
  )

export const Button = ({
  align,
  asLink,
  size,
  to,
  type,
  variant,
  width,
  'aria-label': ariaLabel,
  children,
  disabled,
  onClick,
  viewTransition,
  params,
}: ButtonProps): React.ReactElement => {
  if (asLink) {
    return (
      <Link
        className={styles.button({ align, size, variant, width })}
        to={to}
        aria-label={ariaLabel}
        disabled={disabled}
        params={params}
        viewTransition={viewTransition}
      >
        {children}
      </Link>
    )
  }

  return (
    <button className={styles.button({ align, size, variant, width })} aria-label={ariaLabel} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  )
}
