<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './app-shell.css'

  const { children }: { children: Snippet } = $props()
</script>

<main class={styles.mainContent}>{@render children()}</main>
