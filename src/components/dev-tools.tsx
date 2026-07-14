import { TanStackDevtools } from '@tanstack/solid-devtools'
import { SolidQueryDevtoolsPanel } from '@tanstack/solid-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/solid-router-devtools'

// Ponytail: keep separate + lazy-load behind import.meta.env.DEV in __root, else ~150KB of devtools ships to prod.
export default function DevTools() {
  return (
    <TanStackDevtools
      plugins={[
        { name: 'TanStack Query', render: () => <SolidQueryDevtoolsPanel /> },
        { name: 'TanStack Router', render: () => <TanStackRouterDevtoolsPanel /> },
      ]}
    />
  )
}
