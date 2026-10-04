import { getContext, onMount, setContext, untrack } from 'svelte'
import type { Attachment } from 'svelte/attachments'
import { createAttachmentKey } from 'svelte/attachments'
import type { HTMLButtonAttributes } from 'svelte/elements'
import { on } from 'svelte/events'

const DRAWER_ENDING_MS = 450
const DISMISS_VELOCITY = 0.5
const overlayContext = Symbol('overlay-owner')
const triggerAttachment = createAttachmentKey()
const activeOverlays: symbol[] = []
let scrollLocks = 0
let previousOverflow = ''

/** Spread onto the real trigger, including the attachment symbol used for anchoring and focus return. */
export type TriggerProps = Pick<HTMLButtonAttributes, 'onpointerdown'> & {
  'aria-expanded': boolean
  'aria-haspopup': 'dialog'
  onclick: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => void
  [key: symbol]: Attachment<HTMLButtonElement>
}

interface DrawerOptions {
  cancelDisabled?: boolean
  endingMs?: number
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  swipeable?: boolean
}

/** Call during component setup with a getter, so controlled state and cancellation stay current. */
export const useDrawer = (options: () => DrawerOptions) => {
  let internalOpen = $state(false)
  const isOpen = $derived(options().open ?? internalOpen)
  const endingMs = $derived(options().endingMs ?? DRAWER_ENDING_MS)
  const modal = $derived(options().modal ?? true)
  const swipeable = $derived(options().swipeable ?? true)
  let phase = $state<'ending' | 'starting' | undefined>(untrack(() => isOpen) ? 'starting' : undefined)
  let previousOpen = untrack(() => isOpen)
  const mounted = $derived(isOpen || phase === 'ending')
  let client = $state(false)
  let popup = $state<HTMLDivElement>()
  let backdrop = $state<HTMLDivElement>()
  let trigger = $state<HTMLButtonElement>()
  let inside = false
  const parentMarkInside = getContext<(() => void) | undefined>(overlayContext)
  const owner = Symbol('overlay')

  const markInside = () => {
    inside = true
    parentMarkInside?.()
  }
  setContext(overlayContext, markInside)
  onMount(() => {
    client = true
  })

  const setOpen = (next: boolean) => {
    if (!next && options().cancelDisabled) {
      return
    }
    internalOpen = next
    options().onOpenChange?.(next)
  }
  const close = () => setOpen(false)
  const isTopmost = () => activeOverlays.at(-1) === owner
  const captureTrigger: Attachment<HTMLButtonElement> = (element) => {
    trigger = element
    return () => {
      trigger = undefined
    }
  }
  const triggerProps = (toggle = false): TriggerProps => ({
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    onclick: (event) => {
      trigger = event.currentTarget
      setOpen(toggle ? !isOpen : true)
    },
    onpointerdown: toggle ? markInside : undefined,
    [triggerAttachment]: captureTrigger,
  })

  $effect.pre(() => {
    if (isOpen !== previousOpen) {
      previousOpen = isOpen
      phase = isOpen ? 'starting' : 'ending'
    }
  })

  $effect(() => {
    const currentPhase = phase
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined = undefined
    if (currentPhase === 'ending') {
      timer = setTimeout(() => (phase = undefined), endingMs)
    }
    if (currentPhase === 'starting') {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (phase = undefined))
      })
    }
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  })

  $effect(() => {
    if (!mounted || !popup) {
      return undefined
    }
    activeOverlays.push(owner)
    const returnFocus = untrack(() => trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : undefined))
    const removeKeydown = on(document, 'keydown', (event) => {
      if (isOpen && isTopmost() && (event as KeyboardEvent).key === 'Escape') {
        close()
      }
    })
    return () => {
      removeKeydown()
      activeOverlays.splice(activeOverlays.indexOf(owner), 1)
      if (returnFocus?.isConnected) {
        returnFocus.focus({ preventScroll: true })
      }
    }
  })

  $effect(() => {
    if (!mounted || !modal) {
      return undefined
    }
    if (scrollLocks === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    scrollLocks += 1
    return () => {
      scrollLocks -= 1
      if (scrollLocks === 0) {
        document.body.style.overflow = previousOverflow
      }
    }
  })

  const trackInside = (element: HTMLDivElement) => on(element, 'pointerdown', markInside, { capture: true })
  const dismissOutside = () => {
    inside = false
    return on(document, 'pointerdown', () => {
      if (isOpen && isTopmost() && !inside) {
        close()
      }
      inside = false
    })
  }

  $effect(() => {
    const element = popup
    const scrim = backdrop
    if (!mounted || !swipeable || !element) {
      return undefined
    }
    return swipeToDismiss(element, scrim, () => !options().cancelDisabled, close)
  })

  return {
    get backdrop() {
      return backdrop
    },
    set backdrop(element: HTMLDivElement | undefined) {
      backdrop = element
    },
    get client() {
      return client
    },
    close,
    dismissOutside,
    get isOpen() {
      return isOpen
    },
    markInside,
    get mounted() {
      return mounted
    },
    get phaseProps() {
      return {
        'data-ending-style': phase === 'ending' ? '' : undefined,
        'data-starting-style': phase === 'starting' ? '' : undefined,
      }
    },
    get popup() {
      return popup
    },
    set popup(element: HTMLDivElement | undefined) {
      popup = element
    },
    setOpen,
    trackInside,
    get trigger() {
      return trigger
    },
    triggerProps,
  }
}

const swipeToDismiss = (popup: HTMLDivElement, backdrop: HTMLDivElement | undefined, canDismiss: () => boolean, dismiss: () => void) => {
  const elements = [popup, backdrop]
  const setSwipe = (movement: number, strength = 1) => {
    for (const element of elements) {
      element?.style.setProperty('--drawer-swipe-movement-y', `${movement}px`)
      element?.style.setProperty('--drawer-swipe-progress', String(movement / popup.offsetHeight))
      element?.style.setProperty('--drawer-swipe-strength', String(strength))
    }
  }
  const setSwiping = (swiping: boolean) => {
    for (const element of elements) {
      element?.toggleAttribute('data-swiping', swiping)
    }
    popup.style.transitionDuration = swiping ? '0ms' : ''
  }
  let gesture: { lastTime: number; lastY: number; scroller: Element | null; startY: number; swiping: boolean; velocity: number } | undefined =
    undefined
  const onTouchStart = (event: TouchEvent) => {
    const touchY = event.touches[0].clientY
    const scroller = event.target instanceof Element ? event.target.closest('[data-slot=scroll-area-viewport]') : null
    gesture = { lastTime: event.timeStamp, lastY: touchY, scroller, startY: touchY, swiping: false, velocity: 0 }
  }
  const onTouchMove = (event: TouchEvent) => {
    if (!gesture) {
      return
    }
    const touchY = event.touches[0].clientY
    const movement = touchY - gesture.startY
    if (!gesture.swiping) {
      if (movement === 0) {
        return
      }
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
  const onTouchEnd = () => {
    if (!gesture?.swiping) {
      gesture = undefined
      return
    }
    const movement = Math.max(0, gesture.lastY - gesture.startY)
    const { velocity } = gesture
    gesture = undefined
    setSwiping(false)
    if (canDismiss() && (movement > popup.offsetHeight / 2 || velocity > DISMISS_VELOCITY)) {
      const remaining = popup.offsetHeight - movement
      setSwipe(movement, velocity > 0 ? Math.min(1, Math.max(0.1, remaining / velocity / 400)) : 1)
      dismiss()
    } else {
      setSwipe(0)
    }
  }
  const onTouchCancel = () => {
    gesture = undefined
    setSwiping(false)
    setSwipe(0)
  }
  setSwipe(0)
  popup.addEventListener('touchstart', onTouchStart, { passive: true })
  popup.addEventListener('touchmove', onTouchMove, { passive: false })
  popup.addEventListener('touchend', onTouchEnd)
  popup.addEventListener('touchcancel', onTouchCancel)
  return () => {
    popup.removeEventListener('touchstart', onTouchStart)
    popup.removeEventListener('touchmove', onTouchMove)
    popup.removeEventListener('touchend', onTouchEnd)
    popup.removeEventListener('touchcancel', onTouchCancel)
    setSwiping(false)
  }
}
