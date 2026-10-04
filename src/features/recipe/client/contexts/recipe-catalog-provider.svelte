<script lang="ts">
  import type { Snippet } from 'svelte'

  import type { ReducedRecipe } from '@/types/recipe'

  import { provideRecipeCatalog } from './recipe-catalog-context.svelte'

  const { children, recipes }: { children: Snippet; recipes: readonly ReducedRecipe[] } = $props()
  provideRecipeCatalog(() => recipes)
</script>

{@render children()}
