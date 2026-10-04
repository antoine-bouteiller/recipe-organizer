<script lang="ts">
  import type { RecipeVariants } from '@vanilla-extract/recipes'
  import type { Snippet } from 'svelte'

  import * as styles from './badge.css'

  type BadgeProps = RecipeVariants<typeof styles.badge> & { children?: Snippet }
  const { children, size, variant }: BadgeProps = $props()
</script>

<span class={styles.badge({ size, variant })} data-slot="badge">{@render children?.()}</span>
