<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import { isCurrentPath } from '@/components/navigation/current-path'
  import { desktopMenuItems } from '@/components/navigation/menu-items.svelte'

  interface Props {
    children?: Snippet
    currentPath: string
  }

  const { children, currentPath }: Props = $props()
</script>

<header class="element">
  <div class="navbar" data-slot="navbar">
    <nav class="navigation" data-slot="navbar-items">
      {#each desktopMenuItems as item (item.href)}
        <Link
          aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
          class="app-navbar-item"
          data-slot="navbar-item"
          href={item.href}
        >
          {item.label}
        </Link>
      {/each}
    </nav>
    <div class="actions" data-slot="navbar-actions">
      {@render children?.()}
    </div>
  </div>
</header>

<style>
  .element {
    background: var(--colors-muted);
    display: none;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 50;
  }
  @media screen and (min-width: 768px) {
    .element {
      display: block;
    }
  }
  .navbar {
    align-items: center;
    display: flex;
    gap: 8px;
    height: 56px;
    padding-inline: 24px;
  }

  .navigation {
    align-items: center;
    display: flex;
    gap: 4px;
  }

  .navigation :global(.app-navbar-item) {
    border-radius: var(--radius-md);
    color: var(--colors-muted-foreground);
    font-size: var(--font-sizes-sm);
    font-weight: var(--font-weights-medium);
    padding-block: 4px;
    padding-inline: 10px;
    position: relative;
    transition-duration: 150ms;
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;
    transition-timing-function: var(--easings-in-out);
  }
  .navigation :global(.app-navbar-item[aria-current='page']) {
    color: var(--colors-foreground);
  }

  .navigation :global(.app-navbar-item[aria-current='page'])::after {
    background-color: var(--colors-primary);
    border-radius: var(--radius-full);
    bottom: calc(2px * -1);
    content: '';
    height: 2px;
    inset-inline: 10px;
    position: absolute;
  }

  @media (hover: hover) and (pointer: fine) {
    .navigation :global(.app-navbar-item):hover {
      background-color: var(--colors-accent);
      color: var(--colors-foreground);
    }
  }
  .actions {
    align-items: center;
    display: flex;
    flex: 1 1 0%;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
