<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type ScrollAreaProps = Pick<HTMLAttributes<HTMLDivElement>, 'aria-label'> & {
    children?: Snippet
    scrollbarGutter?: boolean | 'compact'
  }
  const { 'aria-label': ariaLabel, children, scrollbarGutter = false }: ScrollAreaProps = $props()

  const trackOverflow = (element: HTMLDivElement) => {
    const update = () => {
      const { clientHeight, clientWidth, scrollHeight, scrollWidth } = element
      element.toggleAttribute('data-has-overflow-x', scrollWidth > clientWidth)
      element.toggleAttribute('data-has-overflow-y', scrollHeight > clientHeight)
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const child of element.children) {
      observer.observe(child)
    }
    return { destroy: () => observer.disconnect() }
  }
</script>

<div
  aria-label={ariaLabel}
  class={['viewport', { 'scrollbar-gutter-compact': scrollbarGutter === 'compact', 'scrollbar-gutter-true': scrollbarGutter === true }]}
  data-slot="scroll-area-viewport"
  use:trackOverflow
>
  {@render children?.()}
</div>

<style>
  .viewport {
    border-radius: inherit;
    height: 100%;
    min-height: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    overflow: auto;
    scrollbar-color: color-mix(in srgb, var(--colors-foreground) 20%, transparent) transparent;
    scrollbar-width: thin;
    transition-duration: 150ms;
    transition-property: box-shadow;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
  }
  .viewport:global([data-has-overflow-x]) {
    overscroll-behavior-x: contain;
  }
  .viewport:global([data-has-overflow-y]) {
    overscroll-behavior-y: contain;
  }
  .viewport:focus-visible {
    outline: 2px solid var(--colors-ring);
    outline-offset: 1px;
  }
  .scrollbar-gutter-compact:global([data-has-overflow-x]) {
    padding-bottom: 10px;
  }
  .scrollbar-gutter-compact:global([data-has-overflow-y]) {
    padding-inline-end: 4px;
  }
  .scrollbar-gutter-true:global([data-has-overflow-x]) {
    padding-bottom: 10px;
  }
  .scrollbar-gutter-true:global([data-has-overflow-y]) {
    padding-inline-end: 10px;
  }
</style>
