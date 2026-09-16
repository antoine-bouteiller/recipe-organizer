import { cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const kbdRecipe = cva({
  base: {
    '--owner-icon-size': '0.75rem',
    alignItems: 'center',
    backgroundColor: 'secondary',
    borderRadius: 'sm',
    color: 'secondary-foreground',
    display: 'inline-flex',
    fontFamily: 'sans',
    fontSize: 'xs',
    fontWeight: 'medium',
    gap: '1',
    height: '5',
    justifyContent: 'center',
    minWidth: '5',
    paddingInline: '1',
    pointerEvents: 'none',
    userSelect: 'none',
  },
})
const groupRecipe = cva({ base: { alignItems: 'center', display: 'inline-flex', gap: '1' } })
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
