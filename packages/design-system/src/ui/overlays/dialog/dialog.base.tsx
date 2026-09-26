import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { Button } from '@recipe-organizer/design-system/button'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import type { ReactElement, ReactNode } from 'react'

import type { DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

import * as styles from './dialog.base.css'

const DialogBase = ({ title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const formFrame = useDialogFormFrame()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const content: ReactNode = (
    <>
      <div className={styles.header()} data-slot="dialog-header">
        <DialogPrimitive.Title className={styles.element()} data-slot="dialog-title">
          {title}
        </DialogPrimitive.Title>
      </div>
      <ScrollArea scrollFade>
        <div className={styles.panel()} data-slot="dialog-panel">
          {children}
        </div>
      </ScrollArea>
      {hasFooter && (
        <div className={styles.footer()} data-slot="dialog-footer">
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
        <DialogPrimitive.Backdrop className={styles.backdrop()} data-slot="dialog-backdrop" />
        <DialogPrimitive.Viewport className={styles.viewport()} data-slot="dialog-viewport">
          <DialogPrimitive.Popup className={styles.popup()} data-slot="dialog-popup">
            {formFrame?.wrap(content) ?? content}
            <div className={styles.container()}>
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
