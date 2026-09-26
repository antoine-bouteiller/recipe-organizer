import { useRef, useState } from 'react'
import type { TouchEvent } from 'react'

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500
const DIRECTION_LOCK_THRESHOLD = 5
const ELASTIC_FACTOR = 0.15
const RELEASE_TRANSITION = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'

export const useSwipeTabs = <TTab extends string>(tabs: readonly TTab[], defaultTab: TTab) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const widthRef = useRef(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const offsetRef = useRef(0)

  const activeIndex = tabs.indexOf(activeTab)
  // Read via ref so containerRef stays stable; re-invoking it on re-render would snap the offset and kill the release slide.
  const activeIndexRef = useRef(activeIndex)

  const touchState = useRef({
    baseOffset: 0,
    direction: null as 'horizontal' | 'vertical' | null,
    startTime: 0,
    startX: 0,
    startY: 0,
  })

  const setOffset = (value: number, animated: boolean) => {
    offsetRef.current = value
    const element = trackRef.current
    if (!element) {
      return
    }
    const reducedMotion = typeof globalThis.matchMedia === 'function' && globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.style.transition = animated && !reducedMotion ? RELEASE_TRANSITION : 'none'
    element.style.transform = `translate3d(${value}px, 0, 0)`
  }

  const containerRef = (node: HTMLDivElement | null) => {
    if (!node) {
      return undefined
    }
    const syncWidth = () => {
      widthRef.current = node.offsetWidth
      setOffset(-activeIndexRef.current * node.offsetWidth, false)
    }
    syncWidth()
    // A resize changes panel width without remounting, so a cached width would leave every panel past the first misaligned.
    const observer = new ResizeObserver(syncWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }

  const goTo = (tab: TTab) => {
    setActiveTab(tab)
    activeIndexRef.current = tabs.indexOf(tab)
    setOffset(-tabs.indexOf(tab) * widthRef.current, true)
  }

  const clampOffset = (value: number) => {
    const min = -(tabs.length - 1) * widthRef.current
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
    touchState.current = {
      baseOffset: offsetRef.current,
      direction: null,
      startTime: Date.now(),
      startX: touch.clientX,
      startY: touch.clientY,
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches.item(0)
    if (!touch) {
      return
    }
    const state = touchState.current
    const dx = touch.clientX - state.startX
    const dy = touch.clientY - state.startY

    if (!state.direction) {
      if (Math.abs(dx) > DIRECTION_LOCK_THRESHOLD || Math.abs(dy) > DIRECTION_LOCK_THRESHOLD) {
        state.direction = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      }
      return
    }

    if (state.direction === 'horizontal') {
      event.preventDefault()
      setOffset(clampOffset(state.baseOffset + dx), false)
    }
  }

  const onTouchEnd = (event: TouchEvent) => {
    const state = touchState.current

    if (state.direction !== 'horizontal') {
      return
    }

    const touch = event.changedTouches.item(0)
    if (!touch) {
      return
    }
    const dx = touch.clientX - state.startX
    const dt = (Date.now() - state.startTime) / 1000
    const velocity = dx / dt

    const currentIndex = tabs.indexOf(activeTab)
    let newIndex = currentIndex

    if (dx < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
      newIndex = Math.min(currentIndex + 1, tabs.length - 1)
    } else if (dx > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      newIndex = Math.max(currentIndex - 1, 0)
    }

    setActiveTab(tabs[newIndex])
    activeIndexRef.current = newIndex
    setOffset(-newIndex * widthRef.current, true)
  }

  return { activeIndex, activeTab, containerRef, goTo, onTouchEnd, onTouchMove, onTouchStart, trackRef }
}
