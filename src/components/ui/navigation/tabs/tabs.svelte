<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import * as styles from './tabs.css'

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

<div class={styles.root} data-slot="tabs">
  <nav aria-label={ariaLabel} class={styles.list} data-slot="tabs-list">
    {#each items as { label, value } (value)}
      <a class={styles.tab} data-slot="tabs-tab" href={`#${value}`} onclick={(event) => selectTab(event, value)}>{@render label()}</a>
    {/each}
    <!-- Must remain last: indicator geometry derives from sibling-count(). -->
    <span aria-hidden="true" class={styles.indicator} data-slot="tab-indicator">
      <span class={styles.indicatorPill}>
        {#each items as { label, value } (value)}<span class={styles.tab}>{@render label()}</span>{/each}
      </span>
    </span>
  </nav>
  <div class={styles.panels} data-slot="tabs-panels">
    {#each items as { content, value } (value)}
      <div class={styles.panel} data-slot="tabs-panel" id={value}>{@render content()}</div>
    {/each}
  </div>
</div>
