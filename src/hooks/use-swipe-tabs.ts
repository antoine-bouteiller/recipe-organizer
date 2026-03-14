import { animate, type PanInfo, useMotionValue } from 'motion/react'
import { useCallback, useState } from 'react'

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500

const SPRING_CONFIG = { type: 'spring' as const, bounce: 0, duration: 0.35 }

export const useSwipeTabs = <T extends string>(tabs: readonly T[], defaultTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(defaultTab)
  const [containerWidth, setContainerWidth] = useState(0)

  const activeIndex = tabs.indexOf(activeTab)

  const x = useMotionValue(-activeIndex * containerWidth)

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

  const onDragEnd = useCallback(
    (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const { offset, velocity } = info
      const currentIndex = tabs.indexOf(activeTab)

      let newIndex = currentIndex

      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
        newIndex = Math.min(currentIndex + 1, tabs.length - 1)
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
        newIndex = Math.max(currentIndex - 1, 0)
      }

      setActiveTab(tabs[newIndex])
      animate(x, -newIndex * containerWidth, SPRING_CONFIG)
    },
    [activeTab, tabs, containerWidth, x]
  )

  const dragConstraints = {
    left: -(tabs.length - 1) * containerWidth,
    right: 0,
  }

  return { activeIndex, activeTab, containerRef, dragConstraints, x, goTo, onDragEnd }
}
