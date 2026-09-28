import { useDrawer } from '@design-system/hooks/use-drawer'
import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { Button } from '@recipe-organizer/design-system/button'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { useDialogFormFrame } from './dialog-form.private'

import * as drawerStyles from '../drawer/drawer.css'
import * as styles from './dialog.css'

export interface DialogProps {
  /** Render children directly in the popup, without the header, panel, footer, and close button. */
  bare?: boolean
  cancelDisabled?: boolean
  cancelLabel?: string
  children: ReactNode
  footer?: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  title: string
  trigger?: ReactElement
}

/** Exit transition of the centered dialog. */
const DIALOG_ENDING_MS = 200

const dialogSurface = { backdrop: styles.backdrop, popup: styles.popup, slot: 'dialog', viewport: styles.viewport }
const drawerSurface = { backdrop: drawerStyles.backdrop, popup: drawerStyles.popup, slot: 'drawer', viewport: drawerStyles.viewport }

interface ContentProps {
  children: ReactNode
  footer: ReactNode
  title: string
}

const footerOf = (cancelLabel: string | undefined, cancelDisabled: boolean | undefined, close: () => void, footer: ReactNode): ReactNode =>
  (cancelLabel !== undefined || footer !== undefined) && (
    <>
      {cancelLabel !== undefined && (
        <Button disabled={cancelDisabled} onClick={close} variant="outline">
          {cancelLabel}
        </Button>
      )}
      {footer}
    </>
  )

const DialogContent = ({ children, footer, title }: ContentProps): ReactElement => (
  <>
    <div className={styles.header()} data-slot="dialog-header">
      <h2 className={styles.element()} data-slot="dialog-title">
        {title}
      </h2>
    </div>
    <ScrollArea scrollFade>
      <div className={styles.panel()} data-slot="dialog-panel">
        {children}
      </div>
    </ScrollArea>
    {footer && (
      <div className={styles.footer()} data-slot="dialog-footer">
        {footer}
      </div>
    )}
  </>
)

const DrawerContent = ({ children, footer, title }: ContentProps): ReactElement => (
  <>
    <div className={drawerStyles.header()} data-slot="drawer-header">
      <h2 className={drawerStyles.title()} data-slot="drawer-title">
        {title}
      </h2>
    </div>
    <div className={drawerStyles.container()}>
      <ScrollArea scrollFade>
        <div className={drawerStyles.panel()} data-slot="drawer-panel">
          {children}
        </div>
      </ScrollArea>
    </div>
    {footer && (
      <div className={drawerStyles.footer()} data-slot="drawer-footer">
        {footer}
      </div>
    )}
  </>
)

export const Dialog = ({ bare, title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const isMobile = useIsMobile()
  const formFrame = useDialogFormFrame()
  const { backdropRef, close, mounted, phaseProps, popupRef, setOpen } = useDrawer({
    cancelDisabled,
    endingMs: isMobile ? undefined : DIALOG_ENDING_MS,
    onOpenChange,
    open,
    swipeable: isMobile,
  })
  const surface = isMobile ? drawerSurface : dialogSurface
  const Content = isMobile ? DrawerContent : DialogContent
  const content = (
    <Content footer={footerOf(cancelLabel, cancelDisabled, close, footer)} title={title}>
      {children}
    </Content>
  )
  const body = bare ? children : (formFrame?.wrap(content) ?? content)

  return (
    <>
      {trigger !== undefined && (
        <span className={styles.trigger} onClick={() => setOpen(true)}>
          {trigger}
        </span>
      )}
      {mounted &&
        createPortal(
          <>
            <div className={surface.backdrop()} data-slot={`${surface.slot}-backdrop`} ref={backdropRef} {...phaseProps} />
            <div
              className={surface.viewport()}
              data-slot={`${surface.slot}-viewport`}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close()
                }
              }}
            >
              <div aria-label={title} className={surface.popup()} role="dialog" data-slot={`${surface.slot}-popup`} ref={popupRef} {...phaseProps}>
                {body}
                {isMobile ? (
                  <div className={drawerStyles.bar()} data-slot="drawer-bar" />
                ) : (
                  !bare && (
                    <div className={styles.container()}>
                      <Button disabled={cancelDisabled} onClick={close} size="icon" variant="ghost">
                        <XIcon />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
