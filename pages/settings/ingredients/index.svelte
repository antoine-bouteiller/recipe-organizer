<script lang="ts">
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import IngredientsManagement from '@/features/ingredients/client/components/ingredients-management.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'

  import type { Props } from './index.server'

  const { ingredients, isAdmin }: Props = $props()
</script>

<ScreenLayout title="Ingrédients">
  <IngredientCatalogProvider {ingredients}>
    <IngredientsManagement {isAdmin} />
  </IngredientCatalogProvider>
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
