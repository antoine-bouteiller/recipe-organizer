import { Link } from '@tanstack/solid-router'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

export const TabBar = () => (
  <nav class="fixed bottom-0 z-10 flex h-14 w-full items-center justify-around border-t bg-background px-4 md:hidden">
    <For each={items}>
      {(item) => (
        <Link
          {...item.linkProps}
          activeOptions={item.linkProps.to === '/' ? { exact: true } : undefined}
          activeProps={{ class: 'text-primary' }}
          class="flex h-12 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground"
        >
          <Dynamic class="size-6" component={item.icon} />
          {item.label}
        </Link>
      )}
    </For>
  </nav>
)
