import { GearIcon } from '@recipe-organizer/design-system/icons/gear'
import { HouseIcon } from '@recipe-organizer/design-system/icons/house'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { ShoppingCartSimpleIcon } from '@recipe-organizer/design-system/icons/shopping-cart-simple'
import type React from 'react'

interface MenuItem {
  activeIcon: React.ReactNode
  display?: 'desktop' | 'mobile'
  icon: React.ReactNode
  label: string
  linkProps: { to: '/' | '/search' | '/shopping-list' | '/settings' }
}

const menuItems: MenuItem[] = [
  {
    activeIcon: <HouseIcon weight="fill" />,
    icon: <HouseIcon />,
    label: 'Accueil',
    linkProps: {
      to: '/',
    },
  },
  {
    activeIcon: <MagnifyingGlassIcon weight="bold" />,
    display: 'mobile',
    icon: <MagnifyingGlassIcon />,
    label: 'Rechercher',
    linkProps: {
      to: '/search',
    },
  },
  {
    activeIcon: <ShoppingCartSimpleIcon weight="fill" />,
    icon: <ShoppingCartSimpleIcon />,
    label: 'Courses',
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    activeIcon: <GearIcon weight="fill" />,
    icon: <GearIcon />,
    label: 'Paramètres',
    linkProps: {
      to: '/settings',
    },
  },
]

export const desktopMenuItems = menuItems.filter((item) => item.display !== 'mobile')
export const mobileMenuItems = menuItems.filter((item) => item.display !== 'desktop')
