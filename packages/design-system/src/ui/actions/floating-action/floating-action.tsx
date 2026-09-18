import { Link, type LinkOptions } from '@tanstack/react-router'
import type React from 'react'

import { Button } from '../button/button'

import * as styles from './floating-action.css'

interface FloatingActionProps {
  children: React.ReactNode
  label: string
  linkProps: LinkOptions
}

export const FloatingAction = ({ children, label, linkProps }: FloatingActionProps) => (
  <div className={styles.container}>
    <Button aria-label={label} render={<Link {...linkProps} />} size="icon-xl">
      {children}
    </Button>
  </div>
)
