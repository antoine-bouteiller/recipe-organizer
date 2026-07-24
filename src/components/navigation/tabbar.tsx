import { Link } from '@tanstack/react-router'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => (
  <nav className="fixed bottom-0 z-10 flex h-14 w-full items-center justify-around border-t border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
    {items.map((item) => (
      <Link
        key={item.linkProps.to}
        {...item.linkProps}
        activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined}
        activeProps={{ className: 'text-primary' }}
        className="flex h-12 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground"
      >
        <item.icon className="size-6" />
        {item.label}
      </Link>
    ))}
  </nav>
)
