import { animate, useMotionValue } from 'motion/react'
import { type TouchEvent, useCallback, useRef, useState } from 'react'

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500
const DIRECTION_LOCK_THRESHOLD = 5
const ELASTIC_FACTOR = 0.15

const SPRING_CONFIG = { type: 'spring' as const, bounce: 0, duration: 0.35 }

export const useSwipeTabs = <T extends string>(tabs: readonly T[], defaultTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(defaultTab)
  const [containerWidth, setContainerWidth] = useState(0)

  const activeIndex = tabs.indexOf(activeTab)

  const x = useMotionValue(-activeIndex * containerWidth)

  const touchState = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    direction: null as 'horizontal' | 'vertical' | null,
    baseX: 0,
  })

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerWidth(node.offsetWidth)
    }
  }, [])

  const goTo = useCallback(
    (tab: T) => {
      const newIndex = tabs.indexOf(tab)
      setActiveTab(tab)
      animate(x, -newIndex * containerWidth, SPRING_CONFIG)
    },
    [tabs, containerWidth, x]
  )

  const clampX = useCallback(
    (value: number) => {
      const min = -(tabs.length - 1) * containerWidth
      const max = 0
      if (value > max) {
        return max + (value - max) * ELASTIC_FACTOR
      }
      if (value < min) {
        return min + (value - min) * ELASTIC_FACTOR
      }
      return value
    },
    [tabs.length, containerWidth]
  )

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches.item(0)
      if (!touch) {
        return
      }
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        direction: null,
        baseX: x.get(),
      }
    },
    [x]
  )

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
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
        x.set(clampX(state.baseX + dx))
      }
    },
    [x, clampX]
  )

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
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
      animate(x, -newIndex * containerWidth, SPRING_CONFIG)
    },
    [activeTab, tabs, containerWidth, x]
  )

  return { activeIndex, activeTab, containerRef, x, goTo, onTouchStart, onTouchMove, onTouchEnd }
}
