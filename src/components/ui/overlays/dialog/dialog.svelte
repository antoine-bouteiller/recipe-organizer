<script module lang="ts">
  import type { Snippet } from 'svelte'

  import type { TriggerProps } from '@/hooks/use-drawer.svelte'

  export interface DialogProps {
    bare?: boolean
    cancelDisabled?: boolean
    cancelLabel?: string
    children: Snippet
    footer?: Snippet
    onOpenChange?: (open: boolean) => void
    open?: boolean
    title: string
    renderTrigger?: Snippet<[TriggerProps]>
  }
</script>

<script lang="ts">
  import { on } from 'svelte/events'

  import Button from '@/components/ui/actions/button/button.svelte'
  import { XIcon } from '@/components/ui/data-display/icons'
  import ScrollArea from '@/components/ui/layout/scroll-area/scroll-area.svelte'
  import { useDrawer } from '@/hooks/use-drawer.svelte'
  import { useIsMobile } from '@/hooks/use-is-mobile.svelte'

  import { portal } from '../portal.svelte'
  import { useDialogFormFrame } from './dialog-form.private.svelte'

  const { bare, cancelDisabled, cancelLabel, children, footer, onOpenChange, open, title, renderTrigger }: DialogProps = $props()
  const mobile = useIsMobile()
  const formFrame = useDialogFormFrame()
  const drawer = useDrawer(() => ({ cancelDisabled, endingMs: mobile.current ? undefined : 200, onOpenChange, open, swipeable: mobile.current }))
  const surface = $derived({ slot: mobile.current ? 'drawer' : 'dialog' })
  const outsideClick = (element: HTMLDivElement) =>
    on(element, 'click', (event) => {
      if (event.target === element) {
        drawer.close()
      }
    })
</script>

{#snippet actions()}
  {#if cancelLabel !== undefined}<Button disabled={cancelDisabled} onclick={drawer.close} type="button" variant="outline">{cancelLabel}</Button>{/if}
  {@render footer?.()}
{/snippet}

{#snippet content()}
  {#if mobile.current}
    <div class="drawer-header" data-slot="drawer-header"><h2 class="drawer-title" data-slot="drawer-title">{title}</h2></div>
    <div class="drawer-container">
      <ScrollArea><div class="drawer-panel" data-slot="drawer-panel">{@render children()}</div></ScrollArea>
    </div>
    {#if cancelLabel !== undefined || footer}<div class="drawer-footer" data-slot="drawer-footer">{@render actions()}</div>{/if}
  {:else}
    <div class="header" data-slot="dialog-header"><h2 class="element" data-slot="dialog-title">{title}</h2></div>
    <ScrollArea><div class="panel" data-slot="dialog-panel">{@render children()}</div></ScrollArea>
    {#if cancelLabel !== undefined || footer}<div class="footer" data-slot="dialog-footer">{@render actions()}</div>{/if}
  {/if}
{/snippet}

{@render renderTrigger?.(drawer.triggerProps())}
{#if drawer.client && drawer.mounted}
  <div
    class:backdrop={!mobile.current}
    class:drawer-backdrop={mobile.current}
    data-slot={`${surface.slot}-backdrop`}
    bind:this={drawer.backdrop}
    {...drawer.phaseProps}
    {@attach portal}
  ></div>
  <div
    class:viewport={!mobile.current}
    class:drawer-viewport={mobile.current}
    data-slot={`${surface.slot}-viewport`}
    {@attach portal}
    {@attach outsideClick}
  >
    <div
      aria-label={title}
      class:popup={!mobile.current}
      class:drawer-popup={mobile.current}
      role="dialog"
      tabindex="-1"
      data-slot={`${surface.slot}-popup`}
      bind:this={drawer.popup}
      {...drawer.phaseProps}
      {@attach drawer.trackInside}
    >
      {#if bare}{@render children()}{:else if formFrame?.wrap}{@render formFrame.wrap(content)}{:else}{@render content()}{/if}
      {#if mobile.current}<div class="drawer-bar" data-slot="drawer-bar"></div>
      {:else if !bare}<div class="container">
          <Button aria-label="Fermer" disabled={cancelDisabled} onclick={drawer.close} size="icon" type="button" variant="ghost"><XIcon /></Button>
        </div>{/if}
    </div>
  </div>
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

  .drawer-header {
    cursor: default;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
  }

  .drawer-header:has(+ [data-slot='drawer-panel']) {
    padding-bottom: 12px;
  }

  @media screen and (max-width: 639.96px) {
    .drawer-header {
      padding-bottom: 16px;
    }
  }

  .drawer-footer {
    background-color: color-mix(in srgb, var(--colors-muted) 72%, transparent);
    border-top-width: 1px;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    padding-bottom: calc(var(--safe-area-bottom) + 16px);
    padding-inline: 24px;
    padding-top: 16px;
  }

  @media screen and (min-width: 640px) {
    .drawer-footer {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  .drawer-title {
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-semibold);
    line-height: var(--line-heights-none);
  }

  .drawer-panel {
    padding: 24px;
  }

  .drawer-popup:has(.drawer-header) .drawer-panel {
    padding-top: 4px;
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

  .drawer-container {
    min-height: 0px;
    touch-action: auto;
  }

  .backdrop {
    background-color: color-mix(in srgb, var(--colors-scrim) 32%, transparent);
    inset: 0px;
    position: fixed;
    transition: opacity 200ms;
    z-index: 50;
  }

  .backdrop[data-ending-style],
  .backdrop[data-starting-style] {
    opacity: 0;
  }

  .viewport {
    display: grid;
    grid-template-rows: 1fr auto 3fr;
    inset: 0px;
    justify-items: center;
    padding: 16px;
    position: fixed;
    z-index: 50;
  }

  @media screen and (max-width: 639.96px) {
    .viewport {
      grid-template-rows: 1fr auto;
      padding: 0px;
      padding-top: 48px;
    }
  }

  .popup {
    background-clip: padding-box;
    -webkit-background-clip: padding-box;
    background-color: var(--colors-popover);
    border-radius: var(--radius-2xl);
    border-width: 1px;
    box-shadow: var(--shadows-overlay);
    color: var(--colors-popover-foreground);
    display: flex;
    flex-direction: column;
    grid-row-start: 2;
    max-height: 100%;
    max-width: 512px;
    min-height: 0px;
    min-width: 0px;
    outline: 2px solid transparent;
    outline-offset: 2px;
    position: relative;
    transition-duration: 200ms;
    transition-property: scale, opacity, translate;
    transition-timing-function: var(--easings-in-out);
    width: 100%;
  }

  .popup[data-ending-style],
  .popup[data-starting-style] {
    opacity: 0;
  }

  @media screen and (min-width: 640px) {
    .popup[data-ending-style],
    .popup[data-starting-style] {
      scale: 0.98;
    }
  }

  @media screen and (max-width: 639.96px) {
    .popup[data-ending-style],
    .popup[data-starting-style] {
      translate: 0 16px;
    }
  }

  .popup::before {
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadows-edge);
    content: '';
    inset: 0px;
    pointer-events: none;
    position: absolute;
  }

  @media screen and (max-width: 639.96px) {
    .popup::before {
      display: none;
    }
  }

  @media screen and (max-width: 639.96px) {
    .popup {
      border-bottom-width: 0;
      border-inline-width: 0;
      border-radius: var(--radius-none);
      max-width: none;
      transform-origin: bottom;
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
  }

  .header:has(+ [data-slot='dialog-panel']) {
    padding-bottom: 12px;
  }

  @media screen and (max-width: 639.96px) {
    .header {
      padding-bottom: 16px;
    }
  }

  .footer {
    background-color: color-mix(in srgb, var(--colors-muted) 72%, transparent);
    border-top-width: 1px;
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    padding-block: 16px;
    padding-inline: 24px;
  }

  @media screen and (min-width: 640px) {
    .footer {
      border-bottom-left-radius: var(--radius-2xl);
      border-bottom-right-radius: var(--radius-2xl);
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  .panel {
    padding: 24px;
  }

  .panel:has(+ [data-slot='dialog-footer']:not([data-plain])) {
    padding-bottom: 4px;
  }

  .header + .panel {
    padding-top: 4px;
  }

  .element {
    font-family: var(--fonts-heading);
    font-size: var(--font-sizes-xl);
    font-weight: var(--font-weights-semibold);
    line-height: var(--line-heights-none);
  }

  .container {
    inset-inline-end: 8px;
    position: absolute;
    top: 8px;
  }
</style>
