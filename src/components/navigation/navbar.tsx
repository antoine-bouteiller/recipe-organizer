import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/features/recipe/components/search-bar'
import { toggleTheme } from '@/lib/theme'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { menuItems } from './constants'

export const Navbar = () => {
  const router = useRouter()

  const location = useLocation()

  return (
    <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:h-4! px-6">
      <Tabs value={location.href}>
        <TabsList variant="underline">
          {menuItems
            .filter((item) => item.display !== 'mobile')
            .map((item) => (
              <TabsTrigger
                key={item.label}
                value={item.linkProps.to}
                render={<Link {...item.linkProps} />}
              >
                {item.label}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <SearchBar />
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            toggleTheme()
            await router.invalidate()
          }}
        >
          <ThemeIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
