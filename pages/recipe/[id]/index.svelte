<script lang="ts">
  import { useShared } from '@void/svelte'

  import NotFound from '@/components/not-found/not-found.svelte'
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import QuantityControls from '@/features/recipe/client/components/quantity-controls.svelte'
  import RecipeDetails from '@/features/recipe/client/components/recipe-details.svelte'
  import RecipeManagementActions from '@/features/recipe/client/components/recipe-management-actions.svelte'
  import RecipeIngredientGroups from '@/features/recipe/client/components/recipe-section.svelte'

  import type { Props } from './index.server'

  const { recipe, subrecipes }: Props = $props()
  const shared = useShared()
</script>

{#if recipe}
  <ScreenLayout backgroundImage={recipe.image} headerEndItem={shared.authUser ? headerEndItem : undefined} title={recipe.name}>
    <RecipeDetails {recipe} {subrecipes}>
      {#snippet quantityControls()}<QuantityControls recipeId={recipe.id} servings={recipe.servings} />{/snippet}
      {#snippet renderIngredientGroups(props)}<RecipeIngredientGroups {...props} />{/snippet}
    </RecipeDetails>
    {#snippet backButton()}<GoBackButton />{/snippet}
  </ScreenLayout>
  {#snippet headerEndItem()}<RecipeManagementActions recipeId={recipe.id} recipeName={recipe.name} />{/snippet}
{:else}
  <NotFound />
{/if}
