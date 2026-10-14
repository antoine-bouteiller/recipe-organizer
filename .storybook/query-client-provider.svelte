<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
  // A fresh cache per story keeps play functions independent; the defaults match `@/lib/client/query-client`.
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: 24 * 60 * 60_000, retry: false, staleTime: 5 * 60_000 } } })
</script>

<QueryClientProvider {client}>{@render children()}</QueryClientProvider>
