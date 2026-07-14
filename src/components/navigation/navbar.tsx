import { Link, useRouter } from '@tanstack/solid-router'
import { type ReactNode } from 'react'

import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import { toggleTheme } from '@/lib/theme'

import { menuItems } from './constants'

const navItems = menuItems.filter((item) => item.display !== 'mobile')

export const Navbar = ({ search }: { search: ReactNode }) => {
  const router = useRouter()

  return (
    <div className="flex h-14 items-center gap-2 px-6">
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.linkProps.to}
            {...item.linkProps}
            activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined}
            activeProps={{
              className: 'text-foreground after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary',
            }}
            className="relative rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-1 items-center justify-end gap-2">
        {search}
        <Button
          onClick={async () => {
            toggleTheme()
            await router.invalidate()
          }}
          size="icon"
          variant="ghost"
        >
          <ThemeIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
