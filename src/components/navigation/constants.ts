import { GearIcon, HouseIcon, type Icon, type IconProps, MagnifyingGlassIcon, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import type { LinkProps } from '@tanstack/react-router'

interface MenuItem {
  display?: 'desktop' | 'mobile'
  icon: Icon
  iconFilledProps?: IconProps
  label: string
  linkProps: LinkProps
}

export const menuItems: MenuItem[] = [
  {
    icon: HouseIcon,
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
    icon: MagnifyingGlassIcon,
    iconFilledProps: {
      weight: 'bold',
    },
    label: 'Rechercher',
    linkProps: {
      to: '/search',
    },
  },
  {
    icon: ShoppingCartSimpleIcon,
    iconFilledProps: {
      weight: 'fill',
    },
    label: 'Liste de courses',
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    icon: GearIcon,
    iconFilledProps: {
      weight: 'fill',
    },
    label: 'Paramètres',
    linkProps: {
      to: '/settings',
    },
  },
]
