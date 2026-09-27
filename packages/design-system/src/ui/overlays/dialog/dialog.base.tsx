import { ScrollArea } from '@design-system/ui/layout/scroll-area/scroll-area'
import { Button } from '@recipe-organizer/design-system/button'
import { XIcon } from '@recipe-organizer/design-system/icons/x'
import { useEffect, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import type { DialogProps } from './dialog'
import { useDialogFormFrame } from './dialog-form.private'

import * as styles from './dialog.base.css'

const TRANSITION_MS = 200

const DialogBase = ({ title, trigger, children, cancelLabel, cancelDisabled, footer, open, onOpenChange }: DialogProps): ReactElement => {
  const formFrame = useDialogFormFrame()
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen
  const [prevOpen, setPrevOpen] = useState(isOpen)
  const [phase, setPhase] = useState<'ending' | 'starting'>()
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen)
    setPhase(isOpen ? 'starting' : 'ending')
  }
  const mounted = isOpen || phase === 'ending'

  const setOpen = (next: boolean): void => {
    if (!next && cancelDisabled) {
      return
    }
    setInternalOpen(next)
    onOpenChange?.(next)
  }
  const close = (): void => setOpen(false)

  useEffect(() => {
    let frame = 0
    const timeout = setTimeout(() => {
      if (phase === 'ending') {
        setPhase(undefined)
      }
    }, TRANSITION_MS)
    if (phase === 'starting') {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setPhase(undefined))
      })
    }
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [phase])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isOpen && event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  const phaseProps = { 'data-ending-style': phase === 'ending' ? '' : undefined, 'data-starting-style': phase === 'starting' ? '' : undefined }
  const hasFooter = cancelLabel !== undefined || footer !== undefined
  const content: ReactNode = (
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
      {hasFooter && (
        <div className={styles.footer()} data-slot="dialog-footer">
          {cancelLabel !== undefined && (
            <Button disabled={cancelDisabled} onClick={close} variant="outline">
              {cancelLabel}
            </Button>
          )}
          {footer}
        </div>
      )}
    </>
  )
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
            <div className={styles.backdrop()} data-slot="dialog-backdrop" {...phaseProps} />
            <div
              className={styles.viewport()}
              data-slot="dialog-viewport"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close()
                }
              }}
            >
              <div className={styles.popup()} data-slot="dialog-popup" role="dialog" {...phaseProps}>
                {formFrame?.wrap(content) ?? content}
                <div className={styles.container()}>
                  <Button disabled={cancelDisabled} onClick={close} size="icon" variant="ghost">
                    <XIcon />
                  </Button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}

export default DialogBase
