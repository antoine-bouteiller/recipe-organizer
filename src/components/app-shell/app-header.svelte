<script lang="ts">
  import { Link } from '@void/svelte'
  import type { Snippet } from 'svelte'

  import { isCurrentPath } from '@/components/navigation/current-path'
  import { desktopMenuItems } from '@/components/navigation/menu-items.svelte'

  import * as styles from './app-shell.css'

  interface Props {
    children?: Snippet
    currentPath: string
  }

  const { children, currentPath }: Props = $props()
</script>

<header class={styles.element}>
  <div class={styles.navbar} data-slot="navbar">
    <nav class={styles.navigation} data-slot="navbar-items">
      {#each desktopMenuItems as item (item.href)}
        <Link
          aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
          class={styles.navbarItem}
          data-slot="navbar-item"
          href={item.href}
        >
          {item.label}
        </Link>
      {/each}
    </nav>
    <div class={styles.actions} data-slot="navbar-actions">
      {@render children?.()}
    </div>
  </div>
</header>
