import { type LinkProps } from '@tanstack/solid-router'
import Gear from '~icons/ph/gear'
import House from '~icons/ph/house'
import MagnifyingGlass from '~icons/ph/magnifying-glass'
import ShoppingCartSimple from '~icons/ph/shopping-cart-simple'

interface MenuItem {
  display?: 'desktop' | 'mobile'
  icon: typeof House
  label: string
  linkProps: LinkProps
}

export const menuItems: MenuItem[] = [
  {
    icon: House,
    label: 'Accueil',
    linkProps: {
      to: '/',
    },
  },
  {
    display: 'mobile',
    icon: MagnifyingGlass,
    label: 'Rechercher',
    linkProps: {
      to: '/search',
    },
  },
  {
    icon: ShoppingCartSimple,
    label: 'Courses',
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    icon: Gear,
    label: 'Paramètres',
    linkProps: {
      to: '/settings',
    },
  },
]
