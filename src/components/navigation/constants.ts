import {
  GearIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  ShoppingCartSimpleIcon,
  type Icon,
  type IconProps,
} from '@phosphor-icons/react'
import type { LinkProps } from '@tanstack/react-router'

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
