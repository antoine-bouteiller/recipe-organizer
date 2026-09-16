import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cva } from '@recipe-organizer/design-system/css'
import { type ReactElement, type ReactNode } from 'react'

import { Button } from '../../actions/button/button'
import { XIcon } from '../../data-display/icons/x'
import { ScrollArea } from '../../layout/scroll-area/scroll-area'
import { type DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

const backdropClassName = cva({
  base: {
    '&[data-ending-style], &[data-starting-style]': { opacity: '0' },
    backdropFilter: 'blur(4px)',
    backgroundColor: 'black/32',
    inset: '0',
    position: 'fixed',
    transition: 'opacity 200ms',
    zIndex: '50',
  },
})
const viewportClassName = cva({
  base: {
    display: 'grid',
    gridTemplateRows: '1fr auto 3fr',
    inset: '0',
    justifyItems: 'center',
    padding: '4',
    position: 'fixed',
    smDown: { gridTemplateRows: '1fr auto', padding: '0', paddingTop: '12' },
    zIndex: '50',
  },
})
const popupClassName = cva({
  base: {
    '&[data-ending-style], &[data-starting-style]': { opacity: '0' },
    _before: {
      borderRadius: 'calc(token(radii.2xl) - 1px)',
      boxShadow: '0 1px color-mix(in oklab, token(colors.black) 4%, transparent)',
      content: '""',
      inset: '0',
      pointerEvents: 'none',
      position: 'absolute',
    },
    _dark: { _before: { boxShadow: '0 -1px color-mix(in oklab, token(colors.white) 6%, transparent)' } },
    backgroundClip: 'padding-box',
    backgroundColor: 'popover',
    borderRadius: '2xl',
    borderWidth: '1px',
    boxShadow: 'overlay',
    color: 'popover-foreground',
    display: 'flex',
    flexDirection: 'column',
    gridRowStart: '2',
    maxHeight: 'full',
    maxWidth: 'lg',
    minHeight: '0',
    minWidth: '0',
    opacity: 'calc(1 - var(--nested-dialogs))',
    outline: 'none',
    position: 'relative',
    sm: { '&[data-ending-style], &[data-starting-style]': { scale: '0.98' }, scale: 'calc(1 - 0.1 * var(--nested-dialogs))' },
    smDown: {
      '&[data-ending-style], &[data-starting-style]': { translate: '0 1rem' },
      _before: { display: 'none' },
      borderBottomWidth: '0',
      borderInlineWidth: '0',
      borderRadius: '0',
      maxWidth: 'none',
      transformOrigin: 'bottom',
    },
    transitionDuration: '200ms',
    transitionProperty: 'scale, opacity, translate',
    transitionTimingFunction: 'in-out',
    width: 'full',
  },
})
const headerClassName = cva({
  base: {
    '&:has(+ [data-slot=dialog-panel])': { paddingBottom: '3' },
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
    padding: '6',
    smDown: { paddingBottom: '4' },
  },
})
const footerClassName = cva({
  base: {
    backgroundColor: 'muted/72',
    borderTopWidth: '1px',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '2',
    paddingBlock: '4',
    paddingInline: '6',
    sm: { borderBottomRadius: 'calc(token(radii.2xl) - 1px)', flexDirection: 'row', justifyContent: 'flex-end' },
  },
})
const panelClassName = cva({
  base: {
    '&:has(+ [data-slot=dialog-footer]:not([data-plain]))': { paddingBottom: '1' },
    '[data-slot=dialog-header] + &': { paddingTop: '1' },
    padding: '6',
  },
})

const DialogBase = ({ title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const formFrame = useDialogFormFrame()
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const content: ReactNode = (
    <>
      <div className={headerClassName()} data-slot="dialog-header">
        <DialogPrimitive.Title
          className={cva({ base: { fontFamily: 'heading', fontSize: 'xl', fontWeight: 'semibold', lineHeight: 'none' } })()}
          data-slot="dialog-title"
        >
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
            <div className={cva({ base: { insetInlineEnd: '2', position: 'absolute', top: '2' } })()}>
              <DialogPrimitive.Close aria-label="Close" render={<Button size="icon" variant="ghost" />}>
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
