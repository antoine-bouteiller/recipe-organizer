import { Link } from '@tanstack/react-router'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => (
  <nav className="fixed bottom-0 z-10 flex h-14 w-full items-center border-t border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
    {items.map((item) => (
      <Link
        key={item.linkProps.to}
        {...item.linkProps}
        activeProps={{ className: 'text-primary' }}
        inactiveProps={{ className: 'text-muted-foreground' }}
        className="flex h-12 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold transition-[color,scale] duration-150 ease-out-snappy active:scale-[0.97]"
      >
        {({ isActive }) => (
          <>
            <item.icon className="size-6" {...(isActive ? item.iconFilledProps : undefined)} />
            {item.label}
          </>
        )}
      </Link>
    ))}
  </nav>
)
