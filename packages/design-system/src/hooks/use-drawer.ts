import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { RefObject } from 'react'

/** Longest exit transition in drawer.css (swipe strength 1 × 400ms), plus headroom. */
const DRAWER_ENDING_MS = 450
/** Release speed (px/ms) that dismisses the drawer regardless of distance. */
const DISMISS_VELOCITY = 0.5

interface OverlayStateProps {
  cancelDisabled?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

interface OverlayState {
  close: () => void
  mounted: boolean
  phase: 'ending' | 'starting' | undefined
  setOpen: (next: boolean) => void
}

/** Open state, enter/exit transition phases, and Escape handling for a portal overlay. */
const useOverlayState = ({ cancelDisabled, onOpenChange, open }: OverlayStateProps, endingMs: number): OverlayState => {
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
    }, endingMs)
    if (phase === 'starting') {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setPhase(undefined))
      })
    }
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [phase, endingMs])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (isOpen && event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  return { close, mounted, phase, setOpen }
}

interface SwipeToDismissOptions {
  backdropRef: RefObject<HTMLDivElement | null>
  cancelDisabled: boolean | undefined
  enabled: boolean
  onDismiss: () => void
  popupRef: RefObject<HTMLDivElement | null>
}

/** Drawer swipe-down-to-dismiss, driving the swipe variables and attributes drawer.css reads. */
const useSwipeToDismiss = ({ backdropRef, cancelDisabled, enabled, onDismiss, popupRef }: SwipeToDismissOptions): void => {
  const canDismiss = useEffectEvent(() => !cancelDisabled)
  const dismiss = useEffectEvent(onDismiss)
  useEffect(() => {
    const popup = popupRef.current
    if (!enabled || !popup) {
      return undefined
    }
    const elements = [popup, backdropRef.current]
    const setSwipe = (movement: number, strength = 1): void => {
      for (const element of elements) {
        element?.style.setProperty('--drawer-swipe-movement-y', `${movement}px`)
        element?.style.setProperty('--drawer-swipe-progress', String(movement / popup.offsetHeight))
        element?.style.setProperty('--drawer-swipe-strength', String(strength))
      }
    }
    const setSwiping = (swiping: boolean): void => {
      for (const element of elements) {
        element?.toggleAttribute('data-swiping', swiping)
      }
      popup.style.transitionDuration = swiping ? '0ms' : ''
    }

    let gesture: { lastTime: number; lastY: number; scroller: Element | null; startY: number; swiping: boolean; velocity: number } | undefined =
      undefined

    const onTouchStart = (event: TouchEvent): void => {
      const touchY = event.touches[0].clientY
      const scroller = event.target instanceof Element ? event.target.closest('[data-slot=scroll-area-viewport]') : null
      gesture = { lastTime: event.timeStamp, lastY: touchY, scroller, startY: touchY, swiping: false, velocity: 0 }
    }
    const onTouchMove = (event: TouchEvent): void => {
      if (!gesture) {
        return
      }
      const touchY = event.touches[0].clientY
      const movement = touchY - gesture.startY
      if (!gesture.swiping) {
        if (movement === 0) {
          return
        }
        // Leave upward drags and drags inside scrolled content to native scrolling.
        if (movement < 0 || (gesture.scroller?.scrollTop ?? 0) > 0) {
          gesture = undefined
          return
        }
        gesture.swiping = true
        setSwiping(true)
      }
      event.preventDefault()
      const elapsed = event.timeStamp - gesture.lastTime
      if (elapsed > 0) {
        gesture.velocity = (touchY - gesture.lastY) / elapsed
      }
      gesture.lastTime = event.timeStamp
      gesture.lastY = touchY
      setSwipe(Math.max(0, movement))
    }
    const onTouchEnd = (): void => {
      if (!gesture?.swiping) {
        gesture = undefined
        return
      }
      const movement = Math.max(0, gesture.lastY - gesture.startY)
      const { velocity } = gesture
      gesture = undefined
      setSwiping(false)
      if (canDismiss() && (movement > popup.offsetHeight / 2 || velocity > DISMISS_VELOCITY)) {
        // Faster flicks finish the exit sooner, down to 10% of the full duration.
        const remaining = popup.offsetHeight - movement
        setSwipe(movement, velocity > 0 ? Math.min(1, Math.max(0.1, remaining / velocity / 400)) : 1)
        dismiss()
      } else {
        setSwipe(0)
      }
    }

    setSwipe(0)
    popup.addEventListener('touchstart', onTouchStart, { passive: true })
    popup.addEventListener('touchmove', onTouchMove, { passive: false })
    popup.addEventListener('touchend', onTouchEnd)
    popup.addEventListener('touchcancel', onTouchEnd)
    return () => {
      popup.removeEventListener('touchstart', onTouchStart)
      popup.removeEventListener('touchmove', onTouchMove)
      popup.removeEventListener('touchend', onTouchEnd)
      popup.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [backdropRef, enabled, popupRef])
}

interface DrawerOptions extends OverlayStateProps {
  /** Unmount delay once closing starts; must cover the exit transition. */
  endingMs?: number
  /** Enable swipe-down-to-dismiss. */
  swipeable?: boolean
}

interface Drawer {
  backdropRef: RefObject<HTMLDivElement | null>
  close: () => void
  mounted: boolean
  phaseProps: { 'data-ending-style'?: ''; 'data-starting-style'?: '' }
  popupRef: RefObject<HTMLDivElement | null>
  setOpen: (next: boolean) => void
}

/** Portal overlay state with drawer transitions and swipe-to-dismiss; attach the refs to the backdrop and popup. */
export const useDrawer = ({ endingMs = DRAWER_ENDING_MS, swipeable = true, ...props }: DrawerOptions): Drawer => {
  const { close, mounted, phase, setOpen } = useOverlayState(props, endingMs)
  const backdropRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  useSwipeToDismiss({ backdropRef, cancelDisabled: props.cancelDisabled, enabled: swipeable && mounted, onDismiss: close, popupRef })
  const phaseProps = {
    'data-ending-style': phase === 'ending' ? ('' as const) : undefined,
    'data-starting-style': phase === 'starting' ? ('' as const) : undefined,
  }
  return { backdropRef, close, mounted, phaseProps, popupRef, setOpen }
}
