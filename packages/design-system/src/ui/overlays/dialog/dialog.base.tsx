import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { type ReactElement, type ReactNode } from 'react'

import { Button } from '../../actions/button/button'
import { XIcon } from '../../data-display/icons/x'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'
import { type DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

import {
  backdropClassName,
  viewportClassName,
  popupClassName,
  headerClassName,
  footerClassName,
  panelClassName,
  element,
  container,
} from './dialog.base.css'

const DialogBase = ({ title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const formFrame = useDialogFormFrame()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const content: ReactNode = (
    <>
      <div className={headerClassName()} data-slot="dialog-header">
        <DialogPrimitive.Title className={element()} data-slot="dialog-title">
          {title}
        </DialogPrimitive.Title>
      </div>
      <ScrollArea scrollFade>
        <div className={panelClassName()} data-slot="dialog-panel">
          {children}
        </div>
      </ScrollArea>
      {hasFooter && (
        <div className={footerClassName()} data-slot="dialog-footer">
          {cancelLabel !== undefined && (
            <DialogPrimitive.Close render={<Button disabled={cancelDisabled} variant="outline" />}>{cancelLabel}</DialogPrimitive.Close>
          )}
          {footer}
        </div>
      )}
    </>
  )
  return (
    <DialogPrimitive.Root modal="trap-focus" onOpenChange={onOpenChange} open={open}>
      {trigger !== undefined && <DialogPrimitive.Trigger data-slot="dialog-trigger" render={trigger} />}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className={backdropClassName()} data-slot="dialog-backdrop" />
        <DialogPrimitive.Viewport className={viewportClassName()} data-slot="dialog-viewport">
          <DialogPrimitive.Popup className={popupClassName()} data-slot="dialog-popup">
            {formFrame?.wrap(content) ?? content}
            <div className={container()}>
              <DialogPrimitive.Close aria-label="Close" disabled={cancelDisabled} render={<Button size="icon" variant="ghost" />}>
                <XIcon />
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default DialogBase
