import { useDrawer } from '@design-system/hooks/use-drawer'
import { useIsMobile } from '@design-system/hooks/use-is-mobile'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import * as drawerStyles from '../drawer/drawer.css'
import * as styles from './popover.css'

export interface PopoverProps {
  children: ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  trigger: ReactElement
}

/** Exit transition of the anchored popover. */
const POPOVER_ENDING_MS = 150
const SIDE_OFFSET = 4
const COLLISION_PADDING = 8

export const Popover = ({ trigger, children, onOpenChange, open: controlledOpen }: PopoverProps): ReactElement => {
  const isMobile = useIsMobile()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = (next: boolean): void => {
    setUncontrolledOpen(next)
    onOpenChange?.(next)
  }
  const close = useEffectEvent(() => setOpen(false))
  const { backdropRef, mounted, phaseProps, popupRef } = useDrawer({
    endingMs: isMobile ? undefined : POPOVER_ENDING_MS,
    onOpenChange: setOpen,
    open,
    swipeable: isMobile,
  })
  const triggerRef = useRef<HTMLSpanElement>(null)
  // Set by React pointer events, which also bubble from nested portals (e.g. a dialog opened from the popover).
  const insideRef = useRef(false)
  const markInside = (): void => {
    insideRef.current = true
  }

  useEffect(() => {
    if (!open) {
      return undefined
    }
    insideRef.current = false
    const onPointerDown = (): void => {
      if (!insideRef.current) {
        close()
      }
      insideRef.current = false
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  /** Anchors the positioner below the trigger while it is mounted. */
  const anchorPositioner = (positioner: HTMLDivElement): (() => void) | undefined => {
    const anchor = triggerRef.current?.firstElementChild
    if (!anchor) {
      return undefined
    }
    const update = (): void => {
      const rect = anchor.getBoundingClientRect()
      const top = rect.bottom + SIDE_OFFSET
      positioner.style.top = `${top}px`
      positioner.style.left = `${rect.left + rect.width / 2}px`
      positioner.style.setProperty('--available-height', `${window.innerHeight - top - COLLISION_PADDING}px`)
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }

  return (
    <>
      <span className={styles.trigger} onClick={() => setOpen(!open)} onPointerDown={markInside} ref={triggerRef}>
        {trigger}
      </span>
      {mounted &&
        createPortal(
          isMobile ? (
            <>
              <div className={drawerStyles.backdrop} data-slot="drawer-backdrop" ref={backdropRef} {...phaseProps} />
              <div className={drawerStyles.viewport} data-slot="drawer-viewport">
                <div className={drawerStyles.popup} data-slot="drawer-popup" onPointerDown={markInside} ref={popupRef} {...phaseProps}>
                  {children}
                  <div className={drawerStyles.bar} data-slot="drawer-bar" />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.positioner} data-slot="popover-positioner" ref={anchorPositioner}>
              <div className={styles.popup} data-slot="popover-popup" onPointerDown={markInside} {...phaseProps}>
                <div className={styles.viewport} data-slot="popover-viewport">
                  {children}
                </div>
              </div>
            </div>
          ),
          document.body
        )}
    </>
  )
}
