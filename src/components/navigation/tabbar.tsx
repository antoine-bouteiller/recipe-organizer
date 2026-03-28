import { Link, useLocation } from '@tanstack/react-router'

import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => {
  const location = useLocation()

  return (
    <Tabs
      className="fixed bottom-0 z-10 flex h-14 w-full flex-1 items-center border-t bg-background px-4 transition-transform duration-300 ease-out md:hidden"
      value={location.href}
    >
      <TabsList variant="tabbar" indicatorLayoutId="tabbar-indicator">
        {items.map((item) => (
          <TabsTab
            className="h-11 text-primary data-active:text-primary"
            key={item.label}
            nativeButton={false}
            render={<Link {...item.linkProps} />}
            value={item.linkProps.to}
          >
            <item.icon className="size-6" {...(item.linkProps.to === location.href ? item.iconFilledProps : {})} />
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  )
}
