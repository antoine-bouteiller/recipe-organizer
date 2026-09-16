import type React from 'react'

import { kbdRecipe, groupRecipe } from './kbd.css'

export type KbdProps = Pick<React.ComponentProps<'kbd'>, 'children'>

export const Kbd = ({ children }: KbdProps): React.ReactElement => (
  <kbd className={kbdRecipe()} data-slot="kbd">
    {children}
  </kbd>
)
export const KbdGroup = ({ children }: KbdProps): React.ReactElement => (
  <kbd className={groupRecipe()} data-slot="kbd-group">
    {children}
  </kbd>
)
