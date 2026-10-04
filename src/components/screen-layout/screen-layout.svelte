<script lang="ts">
  import type { Snippet } from 'svelte'

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
    <div class="image-header">
      <img alt="" class="image" src={backgroundImage} />
      <div class="image-overlay"></div>
      {#if backButton}<span class="image-back">{@render backButton()}</span>{/if}
      <h1 class="image-title">{title}</h1>
      {#if headerEndItem}<div class="image-action">{@render headerEndItem()}</div>{/if}
    </div>
  {:else}
    <div class="header">
      {@render backButton?.()}
      <h1 class="title">{title}</h1>
      {#if headerEndItem}<div class="header-action">{@render headerEndItem()}</div>{/if}
    </div>
  {/if}
{/snippet}

<div class="screen" data-footer-present={footer ? 'true' : undefined} data-scroll-restoration-id={outerScrollId} data-slot="screen-layout">
  {#if backgroundImage}{@render header()}{/if}
  <div
    class="content"
    data-has-background={Boolean(backgroundImage)}
    data-has-footer={Boolean(footer)}
    data-scroll-restoration-id={innerScrollId}
    data-slot="screen-layout-content"
  >
    {#if !backgroundImage}{@render header()}{/if}
    {@render children?.()}
  </div>
  {@render footer?.()}
</div>

<style>
  .image-header {
    align-items: center;
    background: linear-gradient(to bottom, #0d3b42, var(--colors-primary));
    color: var(--colors-primary-foreground);
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    overflow: hidden;
    padding-bottom: 48px;
    padding-inline: 24px;
    padding-top: calc(var(--safe-area-top) + 16px);
    position: relative;
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    .image-header {
      display: none;
    }
  }
  .image {
    height: 100%;
    inset: 0;
    object-fit: cover;
    object-position: center;
    position: absolute;
    width: 100%;
  }

  .image-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    inset: 0;
    position: absolute;
  }

  .image-back {
    --owner-icon-size: 16px;
    color: var(--colors-inverse-foreground);
    margin-left: -16px;
    position: relative;
    z-index: 10;
  }

  .image-title {
    flex: 1 1 0%;
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-2xl);
    font-weight: var(--font-weights-bold);
    letter-spacing: var(--letter-spacings-tight);
    min-width: 0;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 10;
  }

  .image-action {
    position: relative;
    z-index: 10;
  }

  .header {
    align-items: center;
    background-color: var(--colors-muted);
    color: var(--colors-foreground);
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    height: var(--screen-header-height);
    margin-inline: -16px;
    padding-inline: 16px;
    padding-top: calc(var(--safe-area-top) + 4px);
    position: sticky;
    top: 0;
    width: auto;
    z-index: 20;
  }
  @media screen and (min-width: 768px) {
    .header {
      display: none;
    }
  }
  .title {
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-3xl);
    font-weight: var(--font-weights-bold);
    letter-spacing: var(--letter-spacings-tight);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .header-action {
    margin-inline-start: auto;
    pointer-events: auto;
  }

  .screen {
    align-items: center;
    background-color: var(--colors-muted);
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    .screen {
      overflow: hidden;
      overflow-y: auto;
    }
  }
  .content {
    background-color: var(--colors-muted);
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    padding-inline: 16px;
    position: relative;
    width: 100%;
    z-index: 10;
  }
  @media screen and (min-width: 768px) {
    .content {
      flex: 1 0 auto;
      max-width: 1024px;
      overflow-y: visible;
    }
  }
  .content[data-has-background='true'] {
    border-top-left-radius: var(--radius-3xl);
    border-top-right-radius: var(--radius-3xl);
    margin-top: -40px;
    padding-top: 4px;
  }
  @media screen and (min-width: 768px) {
    .content[data-has-background='true'] {
      margin-top: 0;
    }
  }
  .content[data-has-footer='false'] {
    padding-bottom: 16px;
  }
  .content[data-has-footer='true'] {
    padding-bottom: calc(var(--safe-area-bottom) + 64px);
  }
</style>
