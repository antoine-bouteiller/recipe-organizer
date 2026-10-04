<script lang="ts">
  import type { Snippet } from 'svelte'

  import type { Ingredient } from '@/types/ingredient'

  import { provideIngredientCatalog } from './ingredient-catalog-context.svelte.ts'

  const { children, ingredients }: { children: Snippet; ingredients: readonly Ingredient[] } = $props()
  provideIngredientCatalog(() => ingredients)
</script>

{@render children()}
