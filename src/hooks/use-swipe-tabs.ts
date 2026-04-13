import { animate, useMotionValue } from 'motion/react'
import { useCallback, useRef, useState, type TouchEvent } from 'react'

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500
const DIRECTION_LOCK_THRESHOLD = 5
const ELASTIC_FACTOR = 0.15

const SPRING_CONFIG = { bounce: 0, duration: 0.35, type: 'spring' as const }

export const useSwipeTabs = <TTab extends string>(tabs: readonly TTab[], defaultTab: TTab) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [containerWidth, setContainerWidth] = useState(0)

  const activeIndex = tabs.indexOf(activeTab)

  const swipeX = useMotionValue(-activeIndex * containerWidth)

  const touchState = useRef({
    baseX: 0,
    direction: null as 'horizontal' | 'vertical' | null,
    startTime: 0,
    startX: 0,
    startY: 0,
  })

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerWidth(node.offsetWidth)
    }
  }, [])

  const goTo = useCallback(
    (tab: TTab) => {
      const newIndex = tabs.indexOf(tab)
      setActiveTab(tab)
      animate(swipeX, -newIndex * containerWidth, SPRING_CONFIG)
    },
    [tabs, containerWidth, swipeX]
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
        baseX: swipeX.get(),
        direction: null,
        startTime: Date.now(),
        startX: touch.clientX,
        startY: touch.clientY,
      }
    },
    [swipeX]
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
        swipeX.set(clampX(state.baseX + dx))
      }
    },
    [swipeX, clampX]
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
      animate(swipeX, -newIndex * containerWidth, SPRING_CONFIG)
    },
    [activeTab, tabs, containerWidth, swipeX]
  )

  return { activeIndex, activeTab, containerRef, goTo, onTouchEnd, onTouchMove, onTouchStart, swipeX }
}
