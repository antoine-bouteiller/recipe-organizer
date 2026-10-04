<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as styles from './screen-layout.css'

  interface Props {
    /** Usually `GoBackButton`. */
    backButton?: Snippet
    backgroundImage?: string
    children?: Snippet
    footer?: Snippet
    headerEndItem?: Snippet
    innerScrollId?: string
    outerScrollId?: string
    title: string
  }

  const {
    backButton,
    backgroundImage,
    children,
    footer,
    headerEndItem,
    innerScrollId = 'screen-inner',
    outerScrollId = 'screen-outer',
    title,
  }: Props = $props()
</script>

{#snippet header()}
  {#if backgroundImage}
    <div class={styles.imageHeader}>
      <img alt="" class={styles.image} src={backgroundImage} />
      <div class={styles.imageOverlay}></div>
      {#if backButton}<span class={styles.imageBack}>{@render backButton()}</span>{/if}
      <h1 class={styles.imageTitle}>{title}</h1>
      {#if headerEndItem}<div class={styles.imageAction}>{@render headerEndItem()}</div>{/if}
    </div>
  {:else}
    <div class={styles.header}>
      {@render backButton?.()}
      <h1 class={styles.title}>{title}</h1>
      {#if headerEndItem}<div class={styles.headerAction}>{@render headerEndItem()}</div>{/if}
    </div>
  {/if}
{/snippet}

<div class={styles.screen} data-footer-present={footer ? 'true' : undefined} data-scroll-restoration-id={outerScrollId} data-slot="screen-layout">
  {#if backgroundImage}{@render header()}{/if}
  <div
    class={styles.content({ hasBackground: Boolean(backgroundImage), hasFooter: Boolean(footer) })}
    data-scroll-restoration-id={innerScrollId}
    data-slot="screen-layout-content"
  >
    {#if !backgroundImage}{@render header()}{/if}
    {@render children?.()}
  </div>
  {@render footer?.()}
</div>
