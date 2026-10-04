<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './kbd.css'

  interface KbdGroupProps {
    children?: Snippet
  }
  const { children }: KbdGroupProps = $props()
</script>

<kbd class={styles.group} data-slot="kbd-group">{@render children?.()}</kbd>
