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

  import * as drawerStyles from '../drawer.css'
  import * as styles from './dialog.css'

  const { bare, cancelDisabled, cancelLabel, children, footer, onOpenChange, open, title, renderTrigger }: DialogProps = $props()
  const mobile = useIsMobile()
  const formFrame = useDialogFormFrame()
  const drawer = useDrawer(() => ({ cancelDisabled, endingMs: mobile.current ? undefined : 200, onOpenChange, open, swipeable: mobile.current }))
  const surface = $derived(
    mobile.current
      ? { backdrop: drawerStyles.backdrop, popup: drawerStyles.popup, slot: 'drawer', viewport: drawerStyles.viewport }
      : { backdrop: styles.backdrop, popup: styles.popup, slot: 'dialog', viewport: styles.viewport }
  )
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
    <div class={drawerStyles.header} data-slot="drawer-header"><h2 class={drawerStyles.title} data-slot="drawer-title">{title}</h2></div>
    <div class={drawerStyles.container}>
      <ScrollArea><div class={drawerStyles.panel} data-slot="drawer-panel">{@render children()}</div></ScrollArea>
    </div>
    {#if cancelLabel !== undefined || footer}<div class={drawerStyles.footer} data-slot="drawer-footer">{@render actions()}</div>{/if}
  {:else}
    <div class={styles.header} data-slot="dialog-header"><h2 class={styles.element} data-slot="dialog-title">{title}</h2></div>
    <ScrollArea><div class={styles.panel} data-slot="dialog-panel">{@render children()}</div></ScrollArea>
    {#if cancelLabel !== undefined || footer}<div class={styles.footer} data-slot="dialog-footer">{@render actions()}</div>{/if}
  {/if}
{/snippet}

{@render renderTrigger?.(drawer.triggerProps())}
{#if drawer.client && drawer.mounted}
  <div class={surface.backdrop} data-slot={`${surface.slot}-backdrop`} bind:this={drawer.backdrop} {...drawer.phaseProps} {@attach portal}></div>
  <div class={surface.viewport} data-slot={`${surface.slot}-viewport`} {@attach portal} {@attach outsideClick}>
    <div
      aria-label={title}
      class={surface.popup}
      role="dialog"
      tabindex="-1"
      data-slot={`${surface.slot}-popup`}
      bind:this={drawer.popup}
      {...drawer.phaseProps}
      {@attach drawer.trackInside}
    >
      {#if bare}{@render children()}{:else if formFrame?.wrap}{@render formFrame.wrap(content)}{:else}{@render content()}{/if}
      {#if mobile.current}<div class={drawerStyles.bar} data-slot="drawer-bar"></div>
      {:else if !bare}<div class={styles.container}>
          <Button aria-label="Fermer" disabled={cancelDisabled} onclick={drawer.close} size="icon" type="button" variant="ghost"><XIcon /></Button>
        </div>{/if}
    </div>
  </div>
{/if}
