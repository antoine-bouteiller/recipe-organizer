<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './kbd.css'

  interface KbdProps {
    children?: Snippet
  }
  const { children }: KbdProps = $props()
</script>

<kbd class={styles.kbd} data-slot="kbd">{@render children?.()}</kbd>
