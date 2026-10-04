<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './recipe-form-actions.css'

  const { children }: { readonly children: Snippet } = $props()
</script>

<div class={styles.actions}>{@render children()}</div>
