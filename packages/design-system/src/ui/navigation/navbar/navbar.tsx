import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { css } from '@recipe-organizer/design-system/css'
import type React from 'react'

export interface NavbarProps {
  actions?: React.ReactNode
  children: React.ReactNode
}

export const Navbar = ({ actions, children }: NavbarProps): React.ReactElement => (
  <div className={css({ alignItems: 'center', display: 'flex', gap: '2', height: '14', paddingInline: '6' })} data-slot="navbar">
    <nav className={css({ alignItems: 'center', display: 'flex', gap: '1' })} data-slot="navbar-items">
      {children}
    </nav>
    <div className={css({ alignItems: 'center', display: 'flex', flex: '1', gap: '2', justifyContent: 'flex-end' })} data-slot="navbar-actions">
      {actions}
    </div>
  </div>
)

export type NavbarItemProps = Pick<useRender.ComponentProps<'a'>, 'aria-current' | 'children' | 'href' | 'render'>

const navbarItemClassName = css({
  '&[aria-current=page]': { color: 'foreground' },
  '&[aria-current=page]::after': {
    backgroundColor: 'primary',
    borderRadius: 'full',
    bottom: '-0.5',
    content: '""',
    height: '0.5',
    insetInline: '2.5',
    position: 'absolute',
  },
  _hover: { backgroundColor: 'accent', color: 'foreground' },
  borderRadius: 'md',
  color: 'muted-foreground',
  fontSize: 'sm',
  fontWeight: 'medium',
  paddingBlock: '1',
  paddingInline: '2.5',
  position: 'relative',
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: 'in-out',
})
export const NavbarItem = ({ render, ...props }: NavbarItemProps): React.ReactElement => {
  const mergedProps = mergeProps<'a'>({ className: navbarItemClassName }, props)

  return useRender({ defaultTagName: 'a', props: { ...mergedProps, 'data-slot': 'navbar-item' }, render })
}
