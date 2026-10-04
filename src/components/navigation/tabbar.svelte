<script lang="ts">
  import { Link } from '@void/svelte'

  import { isCurrentPath } from './current-path'
  import type { MenuItem } from './menu-items.svelte'

  interface Props {
    currentPath: string
    items: readonly Pick<MenuItem, 'activeIcon' | 'href' | 'icon' | 'label'>[]
  }

  const { currentPath, items }: Props = $props()
</script>

<nav class="element" data-slot="tab-bar">
  {#each items as item (item.href)}
    <Link
      aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
      class="app-tab-bar-item"
      data-slot="tab-bar-item"
      href={item.href}
      viewTransition={false}
    >
      <span aria-hidden="true" class="icon-slot" data-slot="tab-bar-item-icon-inactive">
        {@render item.icon()}
      </span>
      <span aria-hidden="true" class="active-icon-slot" data-slot="tab-bar-item-icon-active">
        {@render item.activeIcon()}
      </span>
      {item.label}
    </Link>
  {/each}
</nav>

<style>
  .element {
    align-items: center;
    background-color: var(--colors-background);
    box-shadow: var(--shadows-xs);
    bottom: 0;
    display: flex;
    height: calc(64px + var(--safe-area-bottom));
    padding-bottom: var(--safe-area-bottom);
    padding-inline: 8px;
    position: fixed;
    width: 100%;
    z-index: 10;
  }
  @media screen and (min-width: 768px) {
    .element {
      display: none;
    }
  }
  .element :global(.app-tab-bar-item) {
    align-items: center;
    border-radius: var(--radius-xl);
    color: var(--colors-muted-foreground);
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    font-size: var(--font-sizes-xs);
    font-weight: var(--font-weights-medium);
    gap: 4px;
    height: 56px;
    justify-content: center;
    line-height: var(--line-heights-snug);
    min-width: 0;
    transition: color 150ms var(--easings-in-out);
  }
  .element :global(.app-tab-bar-item[aria-current='page']) {
    color: var(--colors-primary);
    font-weight: var(--font-weights-semibold);
  }

  .element :global(.app-tab-bar-item:is(:active, [data-active])) {
    --owner-icon-opacity: 0.8;
  }

  .element :global(.app-tab-bar-item:is(:focus-visible, [data-focus-visible])) {
    outline: 2px solid var(--colors-ring);
    outline-offset: -2px;
  }

  .icon-slot {
    align-items: center;
    border-radius: var(--radius-full);
    display: flex;
    flex-shrink: 0;
    height: 32px;
    justify-content: center;
    max-width: 100%;
    position: relative;
    width: 64px;
    --owner-icon-size: 24px;
  }
  .icon-slot::before {
    background-color: currentColor;
    border-radius: inherit;
    content: '';
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 150ms var(--easings-in-out);
  }

  :global(.app-tab-bar-item:is(:focus-visible, [data-focus-visible])) .icon-slot::before {
    opacity: 0.12;
  }

  .active-icon-slot {
    align-items: center;
    border-radius: var(--radius-full);
    display: flex;
    flex-shrink: 0;
    height: 32px;
    justify-content: center;
    max-width: 100%;
    position: relative;
    width: 64px;
    --owner-icon-size: 24px;
  }
  .active-icon-slot::before {
    background-color: currentColor;
    border-radius: inherit;
    content: '';
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 150ms var(--easings-in-out);
  }

  :global(.app-tab-bar-item:is(:focus-visible, [data-focus-visible])) .active-icon-slot::before {
    opacity: 0.12;
  }

  .active-icon-slot {
    color: color-mix(in srgb, var(--colors-primary) 15%, var(--colors-primary-foreground));
    display: none;
    isolation: isolate;
  }
  .active-icon-slot::after {
    animation: indicator-enter 200ms cubic-bezier(0.4, 0, 0.2, 1);
    background-color: var(--colors-primary);
    border-radius: var(--radius-full);
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
    z-index: -1;
  }

  :global(.app-tab-bar-item[aria-current='page']) .active-icon-slot {
    display: flex;
  }

  :global(.app-tab-bar-item[aria-current='page']) .icon-slot {
    display: none;
  }

  @keyframes indicator-enter {
    from {
      opacity: 0;
      transform: scaleX(0.4);
    }

    to {
      opacity: 1;
      transform: scaleX(1);
    }
  }
</style>
