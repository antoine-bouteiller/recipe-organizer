import { type JSX, Show } from 'solid-js'

import { Button } from '@/components/ui/button'
import { type DialogProps } from '@/components/ui/dialog'
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

const DialogDrawer = (props: DialogProps) => {
  const hasFooter = () => props.cancelLabel !== undefined || props.footer !== undefined
  const wrap = (body: JSX.Element): JSX.Element => (props.contentRender ? props.contentRender(body) : body)

  return (
    <DrawerRoot onOpenChange={props.onOpenChange} open={props.open}>
      <Show when={props.trigger}>
        <DrawerTrigger data-slot="drawer-trigger" {...props.trigger} />
      </Show>
      <DrawerPopup>
        {wrap(
          <>
            <DrawerHeader>
              <DrawerTitle>{props.title}</DrawerTitle>
            </DrawerHeader>
            <DrawerPanel class={props.panelClassName}>{props.children}</DrawerPanel>
            <Show when={hasFooter()}>
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
}

export default DialogDrawer
