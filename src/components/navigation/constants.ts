import { type LinkProps } from '@tanstack/solid-router'
import { Gear, House, type IconProps, MagnifyingGlass, ShoppingCartSimple } from 'phosphor-solid'

interface MenuItem {
  display?: 'desktop' | 'mobile'
  icon: typeof House
  iconFilledProps?: IconProps
  label: string
  linkProps: LinkProps
}

export const menuItems: MenuItem[] = [
  {
    icon: House,
    iconFilledProps: {
      weight: 'fill',
    },
    label: 'Accueil',
    linkProps: {
      to: '/',
    },
  },
  {
    display: 'mobile',
    icon: MagnifyingGlass,
    iconFilledProps: {
      weight: 'bold',
    },
    label: 'Rechercher',
    linkProps: {
      to: '/search',
    },
  },
  {
    icon: ShoppingCartSimple,
    iconFilledProps: {
      weight: 'fill',
    },
    label: 'Courses',
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    icon: Gear,
    iconFilledProps: {
      weight: 'fill',
    },
    label: 'Paramètres',
    linkProps: {
      to: '/settings',
    },
  },
]
