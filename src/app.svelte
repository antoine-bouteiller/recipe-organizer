<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query'

  import AppError from '@/components/app-error/app-error.svelte'
  import AppHeader from '@/components/app-shell/app-header.svelte'
  import AppMain from '@/components/app-shell/app-main.svelte'
  import ThemeToggle from '@/components/app-shell/theme-toggle.svelte'
  import NotFound from '@/components/not-found/not-found.svelte'
  import SearchBar from '@/features/recipe/client/components/search-bar.svelte'
  import { queryClient } from '@/lib/client/query-client'
  import { router } from '@/lib/client/router/router.svelte'

  void router.start()
</script>

<QueryClientProvider client={queryClient}>
  <AppHeader currentPath={router.current.url.pathname}>
    <SearchBar />
    <ThemeToggle />
  </AppHeader>
  <AppMain>
    {#key router.current.url.pathname}
      <AppError error={router.current.error}>
        {#if router.current.notFound}
          <NotFound />
        {:else if router.current.component}
          <router.current.component params={router.current.params} />
        {/if}
      </AppError>
    {/key}
  </AppMain>
</QueryClientProvider>
