import { Show } from 'solid-js'

import { Button } from '@/components/ui/button'
import { type DialogProps, dialogHasFooter, dialogWrap } from '@/components/ui/dialog'
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  Drawer as DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

const DialogDrawer = (props: DialogProps) => (
  <DrawerRoot onOpenChange={props.onOpenChange} open={props.open}>
    <Show when={props.trigger}>{(trigger) => trigger()((triggerProps) => <DrawerTrigger data-slot="drawer-trigger" {...triggerProps} />)}</Show>
    <DrawerPopup>
      {dialogWrap(
        props,
        <>
          <DrawerHeader>
            <DrawerTitle>{props.title}</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel class={props.panelClassName}>{props.children}</DrawerPanel>
          <Show when={dialogHasFooter(props)}>
            <DrawerFooter>
              <Show when={props.cancelLabel !== undefined}>
                <DrawerClose as={Button} disabled={props.cancelDisabled} variant="outline">
                  {props.cancelLabel}
                </DrawerClose>
              </Show>
              {props.footer}
            </DrawerFooter>
          </Show>
        </>
      )}
    </DrawerPopup>
  </DrawerRoot>
)

export default DialogDrawer
