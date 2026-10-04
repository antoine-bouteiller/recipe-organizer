<script lang="ts">
  import { Link } from '@void/svelte'

  import { isCurrentPath } from './current-path'
  import type { MenuItem } from './menu-items.svelte'

  import * as styles from './tabbar.css'

  interface Props {
    currentPath: string
    items: readonly Pick<MenuItem, 'activeIcon' | 'href' | 'icon' | 'label'>[]
  }

  const { currentPath, items }: Props = $props()
</script>

<nav class={styles.element} data-slot="tab-bar">
  {#each items as item (item.href)}
    <Link
      aria-current={isCurrentPath(currentPath, item.href) ? 'page' : undefined}
      class={styles.tabBarItem}
      data-slot="tab-bar-item"
      href={item.href}
      viewTransition={false}
    >
      <span aria-hidden="true" class={styles.iconSlot} data-slot="tab-bar-item-icon-inactive">
        {@render item.icon()}
      </span>
      <span aria-hidden="true" class={styles.activeIconSlot} data-slot="tab-bar-item-icon-active">
        {@render item.activeIcon()}
      </span>
      {item.label}
    </Link>
  {/each}
</nav>
