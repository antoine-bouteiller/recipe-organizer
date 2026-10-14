<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import { recipeListQuery } from '@/features/recipe/client/api/get-all'
  import QuantityControls from '@/features/recipe/client/components/quantity-controls.svelte'
  import RecipeList from '@/features/recipe/client/components/recipe-list.svelte'
  import { sessionQuery } from '@/lib/client/session'

  const recipes = createQuery(() => recipeListQuery())
  const session = createQuery(() => sessionQuery)
</script>

<ScreenLayout title="Recettes">
  <RecipeList canCreate={Boolean(session.data)} recipes={recipes.data ?? []}>
    {#snippet renderCardAction(recipe)}<QuantityControls recipeId={recipe.id} servings={recipe.servings} variant="card" />{/snippet}
  </RecipeList>
  {#snippet footer()}<TabBar currentPath="/" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
