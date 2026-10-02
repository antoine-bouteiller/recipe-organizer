import type React from 'react'

import { GearIcon, HouseIcon, MagnifyingGlassIcon, ShoppingCartSimpleIcon } from '@/components/ui/data-display/icons'

interface MenuItem {
  activeIcon: React.ReactNode
  display?: 'desktop' | 'mobile'
  icon: React.ReactNode
  label: string
  href: '/' | '/search' | '/shopping-list' | '/settings'
}

const menuItems: MenuItem[] = [
  {
    activeIcon: <HouseIcon weight="fill" />,
    href: '/',
    icon: <HouseIcon />,
    label: 'Accueil',
  },
  {
    activeIcon: <MagnifyingGlassIcon weight="bold" />,
    display: 'mobile',
    href: '/search',
    icon: <MagnifyingGlassIcon />,
    label: 'Rechercher',
  },
  {
    activeIcon: <ShoppingCartSimpleIcon weight="fill" />,
    href: '/shopping-list',
    icon: <ShoppingCartSimpleIcon />,
    label: 'Courses',
  },
  {
    activeIcon: <GearIcon weight="fill" />,
    href: '/settings',
    icon: <GearIcon />,
    label: 'Paramètres',
  },
]

export const desktopMenuItems = menuItems.filter((item) => item.display !== 'mobile')
export const mobileMenuItems = menuItems.filter((item) => item.display !== 'desktop')
