<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { TriggerProps } from '@/hooks/use-drawer.svelte'

  interface PopoverProps {
    children: Snippet
    onOpenChange?: (open: boolean) => void
    open?: boolean
    renderTrigger: Snippet<[TriggerProps]>
  }
</script>

<script lang="ts">
  import { useDrawer } from '@/hooks/use-drawer.svelte'
  import { useIsMobile } from '@/hooks/use-is-mobile.svelte'

  import { portal } from '../portal.svelte'

  import * as drawerStyles from '../drawer.css'
  import * as styles from './popover.css'

  const { children, onOpenChange, open, renderTrigger }: PopoverProps = $props()
  const mobile = useIsMobile()
  const drawer = useDrawer(() => ({
    endingMs: mobile.current ? undefined : 150,
    modal: mobile.current,
    onOpenChange,
    open,
    swipeable: mobile.current,
  }))
  const anchorPositioner = (positioner: HTMLDivElement) => {
    const anchor = drawer.trigger
    if (!anchor) {
      return
    }
    const update = () => {
      const rect = anchor.getBoundingClientRect()
      const top = rect.bottom + 4
      positioner.style.top = `${top}px`
      positioner.style.left = `${rect.left + rect.width / 2}px`
      positioner.style.setProperty('--anchor-width', `${rect.width}px`)
      positioner.style.setProperty('--available-height', `${window.innerHeight - top - 8}px`)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }
</script>

{@render renderTrigger(drawer.triggerProps(true))}
{#if drawer.client && drawer.mounted}
  {#if mobile.current}
    <div class={drawerStyles.backdrop} data-slot="drawer-backdrop" bind:this={drawer.backdrop} {...drawer.phaseProps} {@attach portal}></div>
    <div class={drawerStyles.viewport} data-slot="drawer-viewport" {@attach portal} {@attach drawer.dismissOutside}>
      <div class={drawerStyles.popup} data-slot="drawer-popup" bind:this={drawer.popup} {...drawer.phaseProps} {@attach drawer.trackInside}>
        {@render children()}
        <div class={drawerStyles.bar} data-slot="drawer-bar"></div>
      </div>
    </div>
  {:else}
    <div class={styles.positioner} data-slot="popover-positioner" {@attach portal} {@attach anchorPositioner} {@attach drawer.dismissOutside}>
      <div class={styles.popup} data-slot="popover-popup" bind:this={drawer.popup} {...drawer.phaseProps} {@attach drawer.trackInside}>
        <div class={styles.viewport} data-slot="popover-viewport">{@render children()}</div>
      </div>
    </div>
  {/if}
{/if}
