import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { css } from '@recipe-organizer/design-system/css'
import type React from 'react'

export interface TabBarProps {
  children: React.ReactNode
}
export const TabBar = ({ children }: TabBarProps): React.ReactElement => (
  <nav
    className={css({
      alignItems: 'center',
      backdropFilter: 'blur(24px)',
      backgroundColor: 'background/80',
      borderColor: 'border/60',
      borderTopWidth: '1px',
      bottom: '0',
      display: 'flex',
      height: '14',
      md: { display: 'none' },
      paddingInline: '4',
      position: 'fixed',
      width: 'full',
      zIndex: '10',
    })}
    data-slot="tab-bar"
  >
    {children}
  </nav>
)

export type TabBarItemProps = Pick<useRender.ComponentProps<'a'>, 'aria-current' | 'children' | 'href' | 'render'> & {
  activeIcon: React.ReactNode
  icon: React.ReactNode
}
const tabBarItemClassName = css({
  '&[aria-current=page]': { color: 'primary' },
  '&[aria-current=page] [data-slot=tab-bar-item-icon-active]': { display: 'inline' },
  '&[aria-current=page] [data-slot=tab-bar-item-icon-inactive]': { display: 'none' },
  _active: { transform: 'scale(0.97)' },
  alignItems: 'center',
  color: 'muted-foreground',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  fontSize: 'xs',
  fontWeight: 'semibold',
  gap: '1',
  height: '12',
  justifyContent: 'center',
  transitionDuration: '150ms',
  transitionProperty: 'color, transform',
  transitionTimingFunction: 'out-snappy',
})
const iconSlotClassName = css({ '--owner-icon-size': '1.5rem' })
const activeIconSlotClassName = css({ display: 'none' })
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
