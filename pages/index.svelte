<script lang="ts">
  import { useShared } from '@void/svelte'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import QuantityControls from '@/features/recipe/client/components/quantity-controls.svelte'
  import RecipeList from '@/features/recipe/client/components/recipe-list.svelte'

  import type { Props } from './index.server'

  const { recipes }: Props = $props()
  const shared = useShared()
</script>

<ScreenLayout title="Recettes">
  <RecipeList canCreate={Boolean(shared.authUser)} {recipes}>
    {#snippet renderCardAction(recipe)}<QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />{/snippet}
  </RecipeList>
  {#snippet footer()}<TabBar currentPath="/" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
