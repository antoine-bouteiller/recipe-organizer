import type React from 'react'

import * as styles from './kbd.css'

export type KbdProps = Pick<React.ComponentProps<'kbd'>, 'children'>

export const Kbd = ({ children }: KbdProps): React.ReactElement => (
  <kbd className={styles.kbd()} data-slot="kbd">
    {children}
  </kbd>
)
export const KbdGroup = ({ children }: KbdProps): React.ReactElement => (
  <kbd className={styles.group()} data-slot="kbd-group">
    {children}
  </kbd>
)
