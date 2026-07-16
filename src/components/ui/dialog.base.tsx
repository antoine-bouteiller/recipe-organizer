import { Dialog as DialogPrimitive } from '@kobalte/core/dialog'
import { type ComponentProps, type JSX, Show, splitProps } from 'solid-js'
import X from '~icons/ph/x'

import { Button } from '@/components/ui/button'
import { type DialogProps, dialogHasFooter, dialogWrap } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

const DialogHeader = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn('flex flex-col gap-2 p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pb-3 max-sm:pb-4', local.class)}
      data-slot="dialog-header"
      {...rest}
    />
  )
}

const DialogFooter = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'flex flex-col-reverse gap-2 border-t bg-muted/72 px-6 py-4 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]',
        local.class
      )}
      data-slot="dialog-footer"
      {...rest}
    />
  )
}

const DialogTitle = (props: ComponentProps<typeof DialogPrimitive.Title>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <DialogPrimitive.Title class={cn('font-heading font-semibold text-xl leading-none', local.class)} data-slot="dialog-title" {...rest} />
}

const DialogPanel = (props: { class?: string; children: JSX.Element }) => (
  <ScrollArea scrollFade>
    <div
      class={cn(
        'p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1',
        props.class
      )}
      data-slot="dialog-panel"
    >
      {props.children}
    </div>
  </ScrollArea>
)

const DialogBase = (props: DialogProps) => (
  <DialogPrimitive modal onOpenChange={props.onOpenChange} open={props.open}>
    <Show when={props.trigger}>
      {(trigger) => trigger()((triggerProps) => <DialogPrimitive.Trigger data-slot="dialog-trigger" {...triggerProps} />)}
    </Show>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        class="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0"
        data-slot="dialog-backdrop"
      />
      <div
        class="fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4 max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12"
        data-slot="dialog-viewport"
      >
        <DialogPrimitive.Content
          class="relative row-start-2 flex max-h-full min-h-0 w-full max-w-lg min-w-0 flex-col rounded-2xl border bg-popover text-popover-foreground shadow-lg/5 outline-none not-dark:bg-clip-padding data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95 max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0"
          data-slot="dialog-popup"
        >
          {dialogWrap(
            props,
            <>
              <DialogHeader>
                <DialogTitle>{props.title}</DialogTitle>
              </DialogHeader>
              <DialogPanel class={props.panelClassName}>{props.children}</DialogPanel>
              <Show when={dialogHasFooter(props)}>
                <DialogFooter>
                  <Show when={props.cancelLabel !== undefined}>
                    <DialogPrimitive.CloseButton as={Button} disabled={props.cancelDisabled} variant="outline">
                      {props.cancelLabel}
                    </DialogPrimitive.CloseButton>
                  </Show>
                  {props.footer}
                </DialogFooter>
              </Show>
            </>
          )}
          <DialogPrimitive.CloseButton aria-label="Close" as={Button} class="absolute end-2 top-2" size="icon" variant="ghost">
            <X />
          </DialogPrimitive.CloseButton>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  </DialogPrimitive>
)

export default DialogBase
