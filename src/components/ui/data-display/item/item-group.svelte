<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './item.css'

  interface ItemGroupProps {
    children?: Snippet
  }
  const { children }: ItemGroupProps = $props()
</script>

<div class={styles.group} data-slot="item-group" role="list">{@render children?.()}</div>
