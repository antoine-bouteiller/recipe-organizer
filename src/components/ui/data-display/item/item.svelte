<script lang="ts">
  import type { Snippet } from 'svelte'

  interface ItemProps {
    actions?: Snippet
    children?: Snippet
    layout?: 'row'
    media?: Snippet
    title?: Snippet
    variant?: 'outline'
  }
  const { actions, children, media, title, variant, layout }: ItemProps = $props()
</script>

<div
  class={['item', { 'layout-row': layout === 'row', 'variant-outline': variant === 'outline' }]}
  data-slot="item"
  data-variant={variant ?? 'default'}
>
  {#if media !== undefined}<div class="media" data-slot="item-media">{@render media()}</div>{/if}
  {#if title !== undefined || children !== undefined}
    <div class="content" data-slot="item-content">
      {#if title !== undefined}<div class="title" data-slot="item-title">{@render title()}</div>{/if}
      {#if children !== undefined}<p class="description" data-slot="item-description">{@render children()}</p>{/if}
    </div>
  {/if}
  {#if actions !== undefined}<div class="actions" data-slot="item-actions">{@render actions()}</div>{/if}
</div>

<style>
  .item {
    align-items: center;
    border-color: transparent;
    border-radius: var(--radius-md);
    border-width: 1px;
    display: flex;
    flex-wrap: wrap;
    font-size: var(--font-sizes-sm);
    gap: 16px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding: 16px;
    transition-duration: 100ms;
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
    transition-timing-function: var(--easings-in-out);
  }
  .item:is(:focus-visible, :global([data-focus-visible])) {
    border-color: var(--colors-ring);
    box-shadow: var(--shadows-ring);
  }
  .layout-row {
    flex-wrap: nowrap;
  }
  .variant-outline {
    border-color: var(--colors-border);
  }

  .media {
    align-items: center;
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    justify-content: center;
  }
  [data-slot='item']:has([data-slot='item-description']) .media {
    align-self: flex-start;
    transform: translateY(2px);
  }

  .content {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 4px;
  }

  .title {
    align-items: center;
    display: flex;
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
    gap: 8px;
    line-height: var(--line-heights-snug);
    width: fit-content;
  }

  .description {
    align-items: center;
    color: var(--colors-muted-foreground);
    display: flex;
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-normal);
    gap: 4px;
    line-height: var(--line-heights-normal);
    text-wrap: balance;
  }

  .actions {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .description > :global(a) {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  @media (hover: hover) and (pointer: fine) {
    .description > :global(a:hover) {
      color: var(--colors-primary);
    }
  }
</style>
