import { Link, useLocation } from '@tanstack/react-router'

import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => {
  const location = useLocation()

  return (
    <Tabs className="flex h-14 flex-1 items-center border-t bg-background px-4" value={location.href}>
      <TabsList variant="tabbar">
        {items.map((item) => (
          <TabsTab
            className="h-11 text-primary aria-selected:text-primary"
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
