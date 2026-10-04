<script lang="ts">
  import type { RecipeVariants } from '@vanilla-extract/recipes'
  import type { Snippet } from 'svelte'

  import * as styles from './item.css'

  type ItemProps = RecipeVariants<typeof styles.item> & { actions?: Snippet; children?: Snippet; media?: Snippet; title?: Snippet }
  const { actions, children, media, title, variant, layout }: ItemProps = $props()
</script>

<div class={styles.item({ layout, variant })} data-slot="item" data-variant={variant ?? 'default'}>
  {#if media !== undefined}<div class={styles.media} data-slot="item-media">{@render media()}</div>{/if}
  {#if title !== undefined || children !== undefined}
    <div class={styles.content} data-slot="item-content">
      {#if title !== undefined}<div class={styles.title} data-slot="item-title">{@render title()}</div>{/if}
      {#if children !== undefined}<p class={styles.description} data-slot="item-description">{@render children()}</p>{/if}
    </div>
  {/if}
  {#if actions !== undefined}<div class={styles.actions} data-slot="item-actions">{@render actions()}</div>{/if}
</div>
