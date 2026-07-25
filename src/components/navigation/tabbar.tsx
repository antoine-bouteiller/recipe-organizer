import { Link, useRouterState } from '@tanstack/react-router'

import { cn } from '@/utils/cn'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activeIndex = items.findIndex(({ linkProps }) => (linkProps.to === '/' ? pathname === '/' : pathname.startsWith(linkProps.to as string)))

  return (
    <nav className="fixed bottom-0 z-10 flex h-14 w-full items-center border-t border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
      <div className="relative flex h-12 w-full items-center">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 rounded-xl bg-accent transition-[translate] duration-200 ease-out-snappy"
          style={{ translate: `${activeIndex * 100}%`, width: `${100 / items.length}%` }}
        />
        {items.map((item, index) => {
          const isActive = index === activeIndex

          return (
            <Link
              key={item.linkProps.to}
              {...item.linkProps}
              className={cn(
                'relative flex h-12 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold transition-[color,scale] duration-150 ease-out-snappy active:scale-[0.97]',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="size-6" {...(isActive ? item.iconFilledProps : undefined)} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
