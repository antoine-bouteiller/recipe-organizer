<script lang="ts">
  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import RecipeSearch from '@/features/search/client/components/recipe-search.svelte'

  import type { Props } from './index.server'

  const { recipes }: Props = $props()
</script>

<ScreenLayout title="Rechercher">
  <RecipeSearch {recipes} />
  {#snippet footer()}<TabBar currentPath="/search" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
