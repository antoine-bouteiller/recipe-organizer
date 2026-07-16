import { TanStackDevtools } from '@tanstack/solid-devtools'
import { type QueryClient } from '@tanstack/solid-query'
import { SolidQueryDevtoolsPanel } from '@tanstack/solid-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/solid-router-devtools'

// Keep separate + lazy-load behind import.meta.env.DEV in __root, else ~150KB of devtools ships to prod.
// TanStackDevtools mounts in its own detached root, so the query panel can't read the app's QueryClient context — pass it explicitly.
export default function DevTools(props: { client: QueryClient }) {
  return (
    <TanStackDevtools
      plugins={[
        { name: 'TanStack Query', render: () => <SolidQueryDevtoolsPanel client={props.client} /> },
        { name: 'TanStack Router', render: () => <TanStackRouterDevtoolsPanel /> },
      ]}
    />
  )
}
