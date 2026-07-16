import { createSignal } from 'solid-js'

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500
const DIRECTION_LOCK_THRESHOLD = 5
const ELASTIC_FACTOR = 0.15
const RELEASE_TRANSITION = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'

export const useSwipeTabs = <TTab extends string>(tabs: readonly TTab[], defaultTab: TTab) => {
  const [activeTab, setActiveTab] = createSignal<TTab>(defaultTab)

  let width = 0
  let offset = 0
  let trackEl: HTMLDivElement | undefined = undefined

  const touchState = {
    baseOffset: 0,
    direction: null as 'horizontal' | 'vertical' | null,
    startTime: 0,
    startX: 0,
    startY: 0,
  }

  const setOffset = (value: number, animated: boolean) => {
    offset = value
    if (!trackEl) {
      return
    }
    trackEl.style.transition = animated ? RELEASE_TRANSITION : 'none'
    trackEl.style.transform = `translate3d(${value}px, 0, 0)`
  }

  const containerRef = (node: HTMLDivElement) => {
    width = node.offsetWidth
    setOffset(-tabs.indexOf(activeTab()) * node.offsetWidth, false)
  }

  const trackRef = (node: HTMLDivElement) => {
    trackEl = node
  }

  const goTo = (tab: TTab) => {
    setActiveTab(() => tab)
    setOffset(-tabs.indexOf(tab) * width, true)
  }

  const clampOffset = (value: number) => {
    const min = -(tabs.length - 1) * width
    const max = 0
    if (value > max) {
      return max + (value - max) * ELASTIC_FACTOR
    }
    if (value < min) {
      return min + (value - min) * ELASTIC_FACTOR
    }
    return value
  }

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    touchState.baseOffset = offset
    touchState.direction = null
    touchState.startTime = Date.now()
    touchState.startX = touch.clientX
    touchState.startY = touch.clientY
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    const dx = touch.clientX - touchState.startX
    const dy = touch.clientY - touchState.startY

    if (!touchState.direction) {
      if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD || Math.abs(dy) > DIRECTION_LOCK_THRESHOLD) {
        touchState.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      }
      return
    }

    if (touchState.direction === 'horizontal') {
      event.preventDefault()
      setOffset(clampOffset(touchState.baseOffset + dx), false)
    }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (touchState.direction !== 'horizontal') {
      return
    }

    const touch = event.changedTouches.item(0)
    if (!touch) {
      return
    }
    const dx = touch.clientX - touchState.startX
    const dt = (Date.now() - touchState.startTime) / 1000
    const velocity = dx / dt

    const currentIndex = tabs.indexOf(activeTab())
    let newIndex = currentIndex

    if (dx < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
      newIndex = Math.min(currentIndex + 1, tabs.length - 1)
    } else if (dx > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      newIndex = Math.max(currentIndex - 1, 0)
    }

    setActiveTab(() => tabs[newIndex])
    setOffset(-newIndex * width, true)
  }

  return { activeTab, containerRef, goTo, onTouchEnd, onTouchMove, onTouchStart, trackRef }
}
