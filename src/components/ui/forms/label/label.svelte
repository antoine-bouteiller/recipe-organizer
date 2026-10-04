<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './label.css'

  const { children, for: htmlFor }: { children: Snippet; for?: string } = $props()
</script>

<label class={styles.label} data-slot="label" for={htmlFor}>{@render children()}</label>
