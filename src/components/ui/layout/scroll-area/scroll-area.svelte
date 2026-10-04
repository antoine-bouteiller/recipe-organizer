<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import * as styles from './scroll-area.css'

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

<div aria-label={ariaLabel} class={styles.viewport({ scrollbarGutter })} data-slot="scroll-area-viewport" use:trackOverflow>
  {@render children?.()}
</div>
