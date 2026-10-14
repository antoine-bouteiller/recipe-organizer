<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import { ingredientListQuery } from '@/features/ingredients/client/api/get-all'
  import IngredientsManagement from '@/features/ingredients/client/components/ingredients-management.svelte'
  import IngredientCatalogProvider from '@/features/ingredients/client/contexts/ingredient-catalog-provider.svelte'
  import { sessionQuery } from '@/lib/client/session'

  const ingredients = createQuery(() => ingredientListQuery())
  const session = createQuery(() => sessionQuery)
</script>

<ScreenLayout title="Ingrédients">
  <IngredientCatalogProvider ingredients={ingredients.data ?? []}>
    <IngredientsManagement isAdmin={session.data?.role === 'admin'} />
  </IngredientCatalogProvider>
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
