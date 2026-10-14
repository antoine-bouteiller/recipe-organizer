<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import NotFound from '@/components/not-found/not-found.svelte'
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import { recipeDetailQuery } from '@/features/recipe/client/api/get-one'
  import QuantityControls from '@/features/recipe/client/components/quantity-controls.svelte'
  import RecipeDetails from '@/features/recipe/client/components/recipe-details.svelte'
  import RecipeManagementActions from '@/features/recipe/client/components/recipe-management-actions.svelte'
  import RecipeIngredientGroups from '@/features/recipe/client/components/recipe-section.svelte'
  import { sessionQuery } from '@/lib/client/session'

  const { params }: { params: Record<string, string> } = $props()
  const detail = createQuery(() => recipeDetailQuery(Number(params.id)))
  const session = createQuery(() => sessionQuery)
</script>

{#if detail.data}
  {@const { recipe, subrecipes } = detail.data}
  <ScreenLayout backgroundImage={recipe.image} headerEndItem={session.data ? headerEndItem : undefined} title={recipe.name}>
    <RecipeDetails {recipe} {subrecipes}>
      {#snippet quantityControls()}<QuantityControls recipeId={recipe.id} servings={recipe.servings} />{/snippet}
      {#snippet renderIngredientGroups(props)}<RecipeIngredientGroups {...props} />{/snippet}
    </RecipeDetails>
    {#snippet backButton()}<GoBackButton />{/snippet}
  </ScreenLayout>
  {#snippet headerEndItem()}<RecipeManagementActions recipeId={recipe.id} recipeName={recipe.name} />{/snippet}
{:else if detail.isSuccess}
  <NotFound />
{/if}
