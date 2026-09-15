import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cn } from 'cn'
import type React from 'react'

export interface TabBarProps {
  children: React.ReactNode
}

export const TabBar = ({ children }: TabBarProps): React.ReactElement => (
  <nav
    className="fixed bottom-0 z-10 flex h-14 w-full items-center border-t border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden"
    data-slot="tab-bar"
  >
    {children}
  </nav>
)

export interface TabBarItemProps extends useRender.ComponentProps<'a'> {
  activeIcon: React.ReactNode
  icon: React.ReactNode
}

export const TabBarItem = ({ activeIcon, children, className, icon, render, ...props }: TabBarItemProps): React.ReactElement => {
  const defaultProps = {
    children: (
      <>
        <span aria-hidden="true" className="group-aria-[current=page]:hidden" data-slot="tab-bar-item-icon-inactive">
          {icon}
        </span>
        <span aria-hidden="true" className="hidden group-aria-[current=page]:inline" data-slot="tab-bar-item-icon-active">
          {activeIcon}
        </span>
        {children}
      </>
    ),
    className: cn(
      'group flex h-12 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground transition-[color,scale] duration-150 ease-out-snappy active:scale-[0.97] aria-[current=page]:text-primary',
      className
    ),
    'data-slot': 'tab-bar-item',
  }

  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(defaultProps, props),
    render,
  })
}
