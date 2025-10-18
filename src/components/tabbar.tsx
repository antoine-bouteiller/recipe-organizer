import { cn } from '@/lib/utils'
import { useSearchStore } from '@/stores/search.store'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link, useRouterState } from '@tanstack/react-router'
import { menuItems } from './navbar'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { motion, MotionConfig, type Transition } from 'motion/react'

const transition: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 24,
  duration: 0.25,
}

export const TabBar = () => {
  const { search, setSearch } = useSearchStore()

  const location = useRouterState({ select: (s) => s.location })

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
      <MotionConfig transition={transition}>
        <div className="flex justify-around items-center w-full py-2">
          {menuItems
            .filter((item) => item.display !== 'desktop')
            .map((item) => (
              <Button
                variant="ghost"
                className="rounded-full text-primary hover:text-primary relative hover:bg-transparent"
                render={
                  <Link to={item.linkProps.to}>
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn('size-6 z-10')}
                          {...(isActive ? item.iconFilledProps : {})}
                        />
                        {isActive && (
                          <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-accent rounded-full"
                          />
                        )}
                      </>
                    )}
                  </Link>
                }
                key={item.label}
              />
            ))}
        </div>
      </MotionConfig>
    </div>
  )
}
