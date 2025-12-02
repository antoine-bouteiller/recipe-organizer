import { Link, useLocation } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { usePrevious } from '@/hooks/use-previous-value'
import { cn } from '@/utils/cn'

import { menuItems } from './constants'

const items = menuItems.filter((item) => item.display !== 'desktop')

const itemCount = items.length
const buttonWidthPercent = 100 / itemCount

const computeClip = (activeIndex: number) => {
  const itemCenterPercent = (activeIndex / itemCount) * 100 + buttonWidthPercent / 2
  const clipLeft = Math.max(0, itemCenterPercent - buttonWidthPercent / 2) + 2
  const clipRight = Math.max(0, 100 - (itemCenterPercent + buttonWidthPercent / 2)) + 2
  return `inset(0 ${clipRight.toFixed(1)}% 0 ${clipLeft.toFixed(1)}% round var(--radius-3xl))`
}

export const TabBar = () => {
  const location = useLocation()

  const activeIndex = items.findIndex((item) => location.href === item.linkProps.to)

  const isEmpty = activeIndex === -1
  const previousIsEmpty = usePrevious(isEmpty)

  const shouldAnimate = !isEmpty && !previousIsEmpty

  const clipPath = isEmpty ? 'inset(0px 100% 0px 0% round 9999px)' : computeClip(activeIndex)

  return (
    <div
      className={cn('relative flex flex-1 border-border py-2', {
        'border-t': location.pathname !== '/search',
      })}
    >
      <div className="mx-4 flex flex-1 items-center justify-around">
        {items.map((item) => (
          <Button
            className={`
              text-primary
              hover:bg-transparent hover:text-primary
            `}
            key={item.label}
            render={<Link to={item.linkProps.to} />}
            size="lg"
            variant="ghost"
          >
            <item.icon className="size-6" />
          </Button>
        ))}
      </div>
      <div
        aria-hidden
        className={cn(
          `
            absolute inset-x-4 flex h-10 items-center justify-around bg-accent
            text-primary
          `,
          shouldAnimate && 'transition-[clip-path] duration-250 ease-[ease]'
        )}
        style={{ clipPath }}
      >
        {items.map((item) => (
          <item.icon className="size-6" key={item.label} {...(item.linkProps.to === location.href ? item.iconFilledProps : {})} />
        ))}
      </div>
    </div>
  )
}
