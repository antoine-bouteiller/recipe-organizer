<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface TabsItem {
    content: Snippet
    label: Snippet
    value: string
  }
  type TabsProps = Pick<HTMLAttributes<HTMLElement>, 'aria-label'> & { items: readonly TabsItem[] }
  const { 'aria-label': ariaLabel, items }: TabsProps = $props()
  const selectTab = (event: MouseEvent, value: string) => {
    event.preventDefault()
    document.getElementById(value)?.scrollIntoView({ block: 'nearest', inline: 'start' })
    history.replaceState(history.state, '', `#${value}`)
  }
</script>

<div class="root" data-slot="tabs">
  <nav aria-label={ariaLabel} class="list" data-slot="tabs-list">
    {#each items as { label, value } (value)}
      <a class="tab" data-slot="tabs-tab" href={`#${value}`} onclick={(event) => selectTab(event, value)}>{@render label()}</a>
    {/each}
    <!-- Must remain last: indicator geometry derives from sibling-count(). -->
    <span aria-hidden="true" class="indicator" data-slot="tab-indicator">
      <span class="indicator-pill">
        {#each items as { label, value } (value)}<span class="tab">{@render label()}</span>{/each}
      </span>
    </span>
  </nav>
  <div class="panels" data-slot="tabs-panels">
    {#each items as { content, value } (value)}
      <div class="panel" data-slot="tabs-panel" id={value}>{@render content()}</div>
    {/each}
  </div>
</div>

<style>
  .list {
    align-items: center;
    background-color: color-mix(in srgb, var(--colors-foreground) 6%, var(--colors-muted));
    border-radius: var(--radius-lg);
    color: var(--colors-muted-foreground);
    display: flex;
    gap: 2px;
    justify-content: center;
    padding: 2px;
    position: relative;
    width: 100%;
  }

  .indicator {
    --tabs-count: calc(sibling-count() - 1);
    filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1));
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  .indicator-pill {
    align-items: center;
    animation-duration: auto;
    animation-fill-mode: both;
    animation-name: slide;
    animation-timeline: --swipe-tabs;
    animation-timing-function: linear;
    background-color: var(--colors-card);
    color: var(--colors-card-foreground);
    display: flex;
    gap: 2px;
    height: 100%;
    justify-content: center;
    padding: 2px;
  }
  :global(.dark) .indicator-pill {
    background-color: var(--colors-secondary);
    color: var(--colors-secondary-foreground);
  }

  .tab {
    --owner-icon-margin-inline: -2px;
    --owner-icon-size: 18px;
    align-items: center;
    border-color: transparent;
    border-radius: var(--radius-md);
    border-width: 1px;
    cursor: pointer;
    display: flex;
    flex: 1 1 0%;
    font-size: var(--font-sizes-base);
    font-weight: var(--font-weights-medium);
    gap: 6px;
    height: 36px;
    justify-content: center;
    padding-inline: 9px;
    position: relative;
    white-space: nowrap;
  }
  .tab:focus-visible {
    outline: 2px solid var(--colors-ring);
    outline-offset: 1px;
  }
  @media screen and (min-width: 640px) {
    .tab {
      --owner-icon-size: 16px;
      font-size: var(--font-sizes-sm);
      height: 32px;
    }
  }

  .root {
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    gap: 8px;
    min-height: 0px;
    timeline-scope: --swipe-tabs;
  }

  .panels {
    display: flex;
    flex: 1 1 0%;
    min-height: 0px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-timeline: --swipe-tabs x;
    scrollbar-width: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .panels {
      scroll-behavior: auto;
    }
  }

  .panel {
    flex: 0 0 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .tab :global(svg) {
    flex-shrink: 0;
    pointer-events: none;
  }

  @property --tabs-count {
    inherits: true;
    initial-value: 1;
    syntax: '<integer>';
  }
  @keyframes slide {
    from {
      clip-path: inset(
        2px calc(100% - 2px - calc((100% - 2 * 2px - (var(--tabs-count) - 1) * 2px) / var(--tabs-count))) 2px 2px round var(--radius-md)
      );
    }
    to {
      clip-path: inset(
        2px 2px 2px calc(100% - 2px - calc((100% - 2 * 2px - (var(--tabs-count) - 1) * 2px) / var(--tabs-count))) round var(--radius-md)
      );
    }
  }
</style>
