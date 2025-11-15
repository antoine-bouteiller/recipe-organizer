import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { SearchBar } from '@/features/recipe/search-bar'
import { toggleTheme } from '@/lib/theme'
import { Link, useRouter } from '@tanstack/react-router'
import { menuItems } from './constants'

export const Navbar = () => {
  const router = useRouter()

  return (
    <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:h-4! px-6">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems
            .filter((item) => item.display !== 'mobile')
            .map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  className="px-4"
                  render={<Link {...item.linkProps} activeProps={{ className: 'bg-accent' }} />}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
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
