import { Link } from '@tanstack/react-router'

import { Tabs } from '@/components/common/tabs'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = ({ activePage }: { activePage: string }) => (
  <Tabs
    className="fixed bottom-0 z-10 flex h-14 w-full flex-1 items-center border-t bg-background px-4 transition-transform duration-300 ease-out md:hidden"
    indicatorLayoutId="tabbar-indicator"
    items={items.map((item) => ({
      children: <item.icon className="size-6" {...(item.linkProps.to === activePage ? item.iconFilledProps : {})} />,
      className: 'h-11 text-primary data-active:text-primary',
      nativeButton: false,
      render: <Link {...item.linkProps} />,
      value: item.linkProps.to,
    }))}
    value={activePage}
    variant="tabbar"
  />
)
