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
    <div class="drawer-backdrop" data-slot="drawer-backdrop" bind:this={drawer.backdrop} {...drawer.phaseProps} {@attach portal}></div>
    <div class="drawer-viewport" data-slot="drawer-viewport" {@attach portal} {@attach drawer.dismissOutside}>
      <div class="drawer-popup" data-slot="drawer-popup" bind:this={drawer.popup} {...drawer.phaseProps} {@attach drawer.trackInside}>
        {@render children()}
        <div class="drawer-bar" data-slot="drawer-bar"></div>
      </div>
    </div>
  {:else}
    <div class="positioner" data-slot="popover-positioner" {@attach portal} {@attach anchorPositioner} {@attach drawer.dismissOutside}>
      <div class="popup" data-slot="popover-popup" bind:this={drawer.popup} {...drawer.phaseProps} {@attach drawer.trackInside}>
        <div class="viewport" data-slot="popover-viewport">{@render children()}</div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .drawer-backdrop {
    background-color: color-mix(in srgb, var(--colors-scrim) 32%, transparent);
    inset: 0px;
    opacity: calc(1 - var(--drawer-swipe-progress));
    position: fixed;
    transition: opacity 450ms var(--easings-out-snappy);
    z-index: 50;
  }

  .drawer-backdrop[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }

  .drawer-backdrop[data-ending-style],
  .drawer-backdrop[data-starting-style] {
    opacity: 0;
  }

  .drawer-backdrop[data-swiping] {
    transition-duration: 0ms;
  }

  @supports (-webkit-touch-callout: none) {
    .drawer-backdrop {
      position: absolute;
    }
  }

  .drawer-viewport {
    display: grid;
    grid-template-rows: 1fr auto;
    inset: 0px;
    padding-top: 48px;
    position: fixed;
    touch-action: none;
    z-index: 50;
    --bleed: 48px;
  }

  .drawer-popup {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-popover);
    border-top-left-radius: var(--radius-2xl);
    border-top-right-radius: var(--radius-2xl);
    border-top-width: 1px;
    box-shadow: var(--shadows-overlay);
    color: var(--colors-popover-foreground);
    display: flex;
    flex-direction: column;
    grid-row-start: 2;
    max-height: 100%;
    min-height: 0px;
    min-width: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    padding-bottom: var(--safe-area-bottom);
    position: relative;
    touch-action: none;
    transition-duration: 450ms;
    transition-property: translate, box-shadow, height, background-color;
    transition-timing-function: var(--easings-out-snappy);
    translate: 0 var(--drawer-swipe-movement-y);
    width: 100%;
  }

  .drawer-popup:has([data-slot='drawer-bar']) {
    padding-top: 8px;
  }

  .drawer-popup[data-ending-style] {
    transition-duration: calc(var(--drawer-swipe-strength) * 400ms);
  }

  .drawer-popup[data-ending-style],
  .drawer-popup[data-starting-style] {
    box-shadow: var(--shadows-none);
    padding-bottom: 0px;
    translate: 0 calc(100% + var(--safe-area-bottom));
  }

  .drawer-popup[data-swiping] {
    -webkit-user-select: none;
    user-select: none;
  }

  .drawer-popup::before {
    border-top-left-radius: var(--radius-2xl);
    border-top-right-radius: var(--radius-2xl);
    box-shadow: var(--shadows-edge);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  .drawer-popup::after {
    background-color: var(--colors-popover);
    content: '';
    height: var(--bleed);
    inset-block-start: 100%;
    inset-inline: 0px;
    pointer-events: none;
    position: absolute;
  }

  .drawer-bar {
    align-items: center;
    display: flex;
    inset-block-start: 0px;
    inset-inline: 0px;
    justify-content: center;
    padding: 12px;
    pointer-events: none;
    position: absolute;
    touch-action: none;
  }

  .drawer-bar::before {
    background-color: var(--colors-input);
    border-radius: var(--radius-full);
    content: '';
    height: 4px;
    width: 48px;
  }

  .positioner {
    position: fixed;
    translate: -50% 0;
    z-index: 50;
  }

  .popup {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-popover);
    border-radius: var(--radius-lg);
    border-width: 1px;
    box-shadow: var(--shadows-overlay);
    color: var(--colors-popover-foreground);
    display: flex;
    outline: 2px solid transparent;
    outline-offset: 2px;
    position: relative;
    transform-origin: top;
    transition-duration: 150ms;
    transition-property: scale, opacity;
    transition-timing-function: var(--easings-in-out);
  }

  .popup:has(:global([data-slot='calendar'])) {
    border-radius: var(--radius-xl);
  }

  .popup[data-ending-style],
  .popup[data-starting-style] {
    opacity: 0;
    scale: 0.98;
  }

  .popup:has(:global([data-slot='calendar']))::before {
    border-radius: var(--radius-xl);
  }

  .popup::before {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadows-edge);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  .viewport {
    border-radius: inherit;
    max-height: var(--available-height);
    overflow-y: auto;
    padding: 8px;
    position: relative;
  }

  .viewport:has(:global([data-slot='calendar'])) {
    padding: 8px;
  }
</style>
