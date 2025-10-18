import { cn } from '@/lib/utils'
import { useSearchStore } from '@/stores/search.store'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link, useRouterState } from '@tanstack/react-router'
import { menuItems } from './navbar'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { useMemo } from 'react'

const items = menuItems.filter((item) => item.display !== 'desktop')

const itemCount = items.length
const buttonWidth = 48

const buttonWidthPercent = (buttonWidth / 400) * 100

export const TabBar = () => {
  const { search, setSearch } = useSearchStore()

  const location = useRouterState({ select: (s) => s.location })

  const clipPath = useMemo(() => {
    const activeIndex = items.findIndex((item) => location.href === item.linkProps.to)

    if (activeIndex === -1) {
      return 'inset(0px 100% 0px 0% round 17px)'
    }

    const itemCenterPercent = ((activeIndex + 0.5) / itemCount) * 100

    const clipLeft = Math.max(0, itemCenterPercent - buttonWidthPercent / 2)
    const clipRight = Math.max(0, 100 - (itemCenterPercent + buttonWidthPercent / 2))

    return `inset(0 ${clipRight.toFixed(1)}% 0 ${clipLeft.toFixed(1)}% round 17px)`
  }, [location])

  return (
    <div className="flex flex-col items-center border-t border-border bg-background">
      {location.href === '/search' && (
        <div className="px-4 w-full pt-2">
          <InputGroup>
            <InputGroupInput
              placeholder="Rechercher une recette"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
      <div className="relative w-full">
        <div className="flex justify-around items-center w-full py-2 relative">
          {items.map((item) => (
            <Button
              variant="ghost"
              className="rounded-full text-primary hover:text-primary relative hover:bg-transparent"
              render={
                <Link to={item.linkProps.to}>
                  <item.icon className={cn('size-6 z-10')} />
                </Link>
              }
              key={item.label}
            />
          ))}
        </div>
        <div
          className="absolute flex justify-around items-center w-full my-2 transition-[clip-path] duration-250 ease-[ease] bg-accent top-0"
          style={{ clipPath }}
          aria-hidden
        >
          {items.map((item) => (
            <Button
              variant="ghost"
              className="rounded-full text-primary bg-accent py-2"
              key={item.label}
            >
              <item.icon className={cn('size-6 z-10')} {...item.iconFilledProps} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
