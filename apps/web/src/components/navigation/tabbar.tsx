import { TabBar as TabBarPresentation, TabBarItem } from '@recipe-organizer/design-system/tabbar'
import { Link } from '@tanstack/react-router'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => (
  <TabBarPresentation>
    {items.map((item) => (
      <TabBarItem activeIcon={item.activeIcon} icon={item.icon} key={item.linkProps.to} render={<Link {...item.linkProps} />}>
        {item.label}
      </TabBarItem>
    ))}
  </TabBarPresentation>
)
