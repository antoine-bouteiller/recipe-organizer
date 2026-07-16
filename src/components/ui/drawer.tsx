import CorvuDrawer from '@corvu/drawer'
import { type ComponentProps, type JSX, splitProps } from 'solid-js'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/cn'

export const Drawer = (props: ComponentProps<typeof CorvuDrawer>) => <CorvuDrawer side="bottom" {...props} />

export { Close as DrawerClose, Trigger as DrawerTrigger } from '@corvu/drawer'

export const DrawerPopup = (props: { class?: string; children: JSX.Element }) => {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <CorvuDrawer.Portal>
      <CorvuDrawer.Overlay
        class="fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-closed:opacity-0 data-open:opacity-100"
        data-slot="drawer-backdrop"
      />
      <CorvuDrawer.Content
        class={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[92%] min-h-0 w-full flex-col rounded-t-2xl border-t bg-popover not-dark:bg-clip-padding pb-[env(safe-area-inset-bottom,0px)] text-popover-foreground shadow-lg/5 outline-none transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-12 after:bg-popover has-data-[slot=drawer-bar]:pt-2 data-transitioning:select-none',
          local.class
        )}
        data-slot="drawer-popup"
        {...rest}
      >
        {local.children}
        <div
          aria-hidden
          class="absolute inset-x-0 top-0 flex touch-none items-center justify-center p-3 before:h-1 before:w-12 before:rounded-full before:bg-input"
          data-slot="drawer-bar"
        />
      </CorvuDrawer.Content>
    </CorvuDrawer.Portal>
  )
}

export const DrawerHeader = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn('flex cursor-default flex-col gap-2 p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-panel])]:pb-3 max-sm:pb-4', local.class)}
      data-slot="drawer-header"
      {...rest}
    />
  )
}

export const DrawerFooter = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <div
      class={cn(
        'flex flex-col-reverse gap-2 border-t bg-muted/72 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+--spacing(4))] sm:flex-row sm:justify-end',
        local.class
      )}
      data-slot="drawer-footer"
      {...rest}
    />
  )
}

export const DrawerTitle = (props: ComponentProps<typeof CorvuDrawer.Label>) => {
  const [local, rest] = splitProps(props, ['class'])
  return <CorvuDrawer.Label class={cn('font-heading font-semibold text-xl leading-none', local.class)} data-slot="drawer-title" {...rest} />
}

export const DrawerPanel = (props: { class?: string; children: JSX.Element }) => (
  <ScrollArea class="touch-auto" scrollFade>
    <div
      class={cn(
        'p-6 in-[[data-slot=drawer-popup]:has([data-slot=drawer-header])]:pt-1 in-[[data-slot=drawer-popup]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1',
        props.class
      )}
      data-slot="drawer-panel"
    >
      {props.children}
    </div>
  </ScrollArea>
)
