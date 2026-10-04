<script lang="ts">
  import type { Snippet } from 'svelte'

  import { provideLinkedRecipes } from './linked-recipes-context.svelte'

  const { children, linkedRecipeIds }: { children: Snippet; linkedRecipeIds: readonly number[] } = $props()
  provideLinkedRecipes(() => linkedRecipeIds)
</script>

{@render children()}
