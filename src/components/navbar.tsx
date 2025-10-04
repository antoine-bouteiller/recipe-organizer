import { ShoppingCartIcon } from '@/components/icons/cart'
import { HomeIcon } from '@/components/icons/home'
import { SearchIcon } from '@/components/icons/search'
import { SettingsIcon } from '@/components/icons/settings'
import { ThemeIcon } from '@/components/icons/theme'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { SearchBar } from '@/features/recipe/search-bar'
import { useTheme } from '@/features/theme/theme-provider'
import { Link, type LinkProps } from '@tanstack/react-router'

interface MenuItem {
  label: string
  icon: React.ElementType
  linkProps: LinkProps
  display?: 'desktop' | 'mobile'
}

export const menuItems: MenuItem[] = [
  {
    label: 'Accueil',
    icon: HomeIcon,
    linkProps: {
      to: '/',
    },
  },
  {
    label: 'Rechercher',
    icon: SearchIcon,
    linkProps: {
      to: '/search',
    },
    display: 'mobile',
  },
  {
    label: 'Liste de courses',
    icon: ShoppingCartIcon,
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    label: 'Paramètres',
    icon: SettingsIcon,
    linkProps: {
      to: '/settings',
    },
  },
]

export const Navbar = () => {
  const { toggleTheme } = useTheme()

  return (
    <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4 px-6">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {menuItems
            .filter((item) => item.display !== 'mobile')
            .map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link {...item.linkProps} activeProps={{ className: 'bg-accent' }}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <SearchBar />
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <ThemeIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
