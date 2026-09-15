import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from 'cn'
import type React from 'react'

export interface NavbarProps {
  actions?: React.ReactNode
  children: React.ReactNode
}

export const Navbar = ({ actions, children }: NavbarProps): React.ReactElement => (
  <div className="flex h-14 items-center gap-2 px-6" data-slot="navbar">
    <nav className="flex items-center gap-1" data-slot="navbar-items">
      {children}
    </nav>
    <div className="flex flex-1 items-center justify-end gap-2" data-slot="navbar-actions">
      {actions}
    </div>
  </div>
)

export type NavbarItemProps = useRender.ComponentProps<'a'>

export const NavbarItem = ({ className, render, ...props }: NavbarItemProps): React.ReactElement => {
  const defaultProps = {
    className: cn(
      'relative rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-2.5 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary',
      className
    ),
    'data-slot': 'navbar-item',
  }

  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(defaultProps, props),
    render,
  })
}
