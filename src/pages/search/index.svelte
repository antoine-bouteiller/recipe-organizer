<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import { recipeListQuery } from '@/features/recipe/client/api/get-all'
  import RecipeSearch from '@/features/search/client/components/recipe-search.svelte'

  const recipes = createQuery(() => recipeListQuery())
</script>

<ScreenLayout title="Rechercher">
  <RecipeSearch recipes={recipes.data ?? []} />
  {#snippet footer()}<TabBar currentPath="/search" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
