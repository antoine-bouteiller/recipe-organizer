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
import {
  GearIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  ShoppingCartSimpleIcon,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react'
import { Link, type LinkProps } from '@tanstack/react-router'

interface MenuItem {
  label: string
  icon: Icon
  linkProps: LinkProps
  display?: 'desktop' | 'mobile'
  iconFilledProps?: IconProps
}

export const menuItems: MenuItem[] = [
  {
    label: 'Accueil',
    icon: HouseIcon,
    linkProps: {
      to: '/',
    },
    iconFilledProps: {
      weight: 'fill',
    },
  },
  {
    label: 'Rechercher',
    icon: MagnifyingGlassIcon,
    linkProps: {
      to: '/search',
    },
    display: 'mobile',
    iconFilledProps: {
      weight: 'bold',
    },
  },
  {
    label: 'Liste de courses',
    icon: ShoppingCartSimpleIcon,
    linkProps: {
      to: '/shopping-list',
    },
    iconFilledProps: {
      weight: 'fill',
    },
  },
  {
    label: 'Paramètres',
    icon: GearIcon,
    linkProps: {
      to: '/settings',
    },
    iconFilledProps: {
      weight: 'fill',
    },
  },
]

export const Navbar = () => {
  const { toggleTheme } = useTheme()

  return (
    <div className="3xl:fixed:container flex h-14 items-center gap-2 **:data-[slot=separator]:!h-4 px-6">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems
            .filter((item) => item.display !== 'mobile')
            .map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
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
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <ThemeIcon className="size-6" />
        </Button>
      </div>
    </div>
  )
}
