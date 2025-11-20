import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { useMemo, useRef } from 'react'
import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

const itemCount = items.length
const buttonWidthPercent = 100 / itemCount

export const TabBar = () => {
  const location = useLocation()
  const previousIsEmptyRef = useRef(true)

  const { clipPath, shouldAnimate } = useMemo(() => {
    const activeIndex = items.findIndex((item) => location.href === item.linkProps.to)

    const isEmpty = activeIndex === -1
    const shouldAnimate = !isEmpty && !previousIsEmptyRef.current

    previousIsEmptyRef.current = isEmpty

    if (isEmpty) {
      return {
        clipPath: 'inset(0px 100% 0px 0% round 9999px)',
        shouldAnimate: false,
      }
    }

    const itemCenterPercent = (activeIndex / itemCount) * 100 + buttonWidthPercent / 2

    const clipLeft = Math.max(0, itemCenterPercent - buttonWidthPercent / 2) + 2
    const clipRight = Math.max(0, 100 - (itemCenterPercent + buttonWidthPercent / 2)) + 2

    return {
      clipPath: `inset(0 ${clipRight.toFixed(1)}% 0 ${clipLeft.toFixed(1)}% round var(--radius-3xl))`,
      shouldAnimate,
    }
  }, [location])

  return (
    <div className="relative flex flex-1 py-2 border-t border-border">
      <div className="flex justify-around items-center flex-1 mx-4">
        {items.map((item) => (
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:text-primary hover:bg-transparent"
            render={<Link to={item.linkProps.to} />}
            key={item.label}
          >
            <item.icon className="size-6" />
          </Button>
        ))}
      </div>
      <div
        className={cn(
          'absolute flex justify-around items-center bg-accent h-10 text-primary inset-x-4',
          shouldAnimate && 'transition-[clip-path] duration-250 ease-[ease]'
        )}
        style={{ clipPath }}
        aria-hidden
      >
        {items.map((item) => (
          <item.icon
            className="size-6"
            key={item.label}
            {...(item.linkProps.to === location.href ? item.iconFilledProps : {})}
          />
        ))}
      </div>
    </div>
  )
}
