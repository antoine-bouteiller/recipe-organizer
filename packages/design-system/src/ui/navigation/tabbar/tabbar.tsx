import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type React from 'react'

import { element, tabBarItemClassName, iconSlotClassName, activeIconSlotClassName } from './tabbar.css'

export interface TabBarProps {
  children: React.ReactNode
}
export const TabBar = ({ children }: TabBarProps): React.ReactElement => (
  <nav className={element} data-slot="tab-bar">
    {children}
  </nav>
)

export type TabBarItemProps = Pick<useRender.ComponentProps<'a'>, 'aria-current' | 'children' | 'href' | 'render'> & {
  activeIcon: React.ReactNode
  icon: React.ReactNode
}

export const TabBarItem = ({ activeIcon, children, icon, render, ...props }: TabBarItemProps): React.ReactElement => {
  const mergedProps = mergeProps<'a'>(
    {
      children: (
        <>
          <span aria-hidden="true" className={iconSlotClassName} data-slot="tab-bar-item-icon-inactive">
            {icon}
          </span>
          <span aria-hidden="true" className={`${iconSlotClassName} ${activeIconSlotClassName}`} data-slot="tab-bar-item-icon-active">
            {activeIcon}
          </span>
          {children}
        </>
      ),
      className: tabBarItemClassName,
    },
    props
  )

  return useRender({ defaultTagName: 'a', props: { ...mergedProps, 'data-slot': 'tab-bar-item' }, render })
}
