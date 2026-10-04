<script lang="ts">
  import type { Snippet } from 'svelte'

  import { useField } from './field-context.svelte'

  const { children, id }: { children?: Snippet; id?: string } = $props()
  const field = useField()
</script>

{#if field.invalid && (children || field.error)}
  <div class="error" data-slot="field-error" {id} role="alert">
    {#if children}{@render children()}{:else}{field.error}{/if}
  </div>
{/if}

<style>
  .error {
    color: var(--colors-destructive-foreground);
    font-size: var(--font-sizes-xs);
  }
</style>
