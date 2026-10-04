<script lang="ts">
  import '@/styles/global.css'
  import '@/styles/styles.css'
  import { useShared } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import AppError from '@/components/app-error/app-error.svelte'
  import AppHeader from '@/components/app-shell/app-header.svelte'
  import AppMain from '@/components/app-shell/app-main.svelte'
  import ThemeToggle from '@/components/app-shell/theme-toggle.svelte'
  import SearchBar from '@/features/recipe/client/components/search-bar.svelte'

  const { children }: { children: Snippet } = $props()
  const shared = useShared()
</script>

<AppHeader currentPath={shared.pathname}>
  <SearchBar />
  <ThemeToggle />
</AppHeader>
<AppMain>
  {#key shared.pathname}
    <AppError>{@render children()}</AppError>
  {/key}
</AppMain>
