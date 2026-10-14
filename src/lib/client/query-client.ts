import { QueryClient } from '@tanstack/svelte-query'

export const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 24 * 60 * 60_000, staleTime: 5 * 60_000 } } })
