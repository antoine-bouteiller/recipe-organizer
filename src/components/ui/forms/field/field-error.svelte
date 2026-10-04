<script lang="ts">
  import type { Snippet } from 'svelte'

  import { useField } from './field-context.svelte'

  import * as styles from './field.css'

  const { children, id }: { children?: Snippet; id?: string } = $props()
  const field = useField()
</script>

{#if field.invalid && (children || field.error)}
  <div class={styles.error} data-slot="field-error" {id} role="alert">
    {#if children}{@render children()}{:else}{field.error}{/if}
  </div>
{/if}
