import { Link, useRouter } from '@tanstack/solid-router'
import { For, type JSX } from 'solid-js'

import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import { toggleTheme } from '@/lib/theme'

import { menuItems } from './constants'

const navItems = menuItems.filter((item) => item.display !== 'mobile')

export const Navbar = (props: { search: JSX.Element }) => {
  const router = useRouter()

  return (
    <div class="flex h-14 items-center gap-2 px-6">
      <nav class="flex items-center gap-1">
        <For each={navItems}>
          {(item) => (
            <Link
              {...item.linkProps}
              activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined}
              activeProps={{
                class: 'text-foreground after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary',
              }}
              class="relative rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          )}
        </For>
      </nav>
      <div class="flex flex-1 items-center justify-end gap-2">
        {props.search}
        <Button
          onClick={async () => {
            toggleTheme()
            await router.invalidate()
          }}
          size="icon"
          variant="ghost"
        >
          <ThemeIcon class="size-6" />
        </Button>
      </div>
    </div>
  )
}
