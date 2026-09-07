import { type LinkProps } from '@tanstack/react-router'
import type React from 'react'

import { GearIcon, HouseIcon, MagnifyingGlassIcon, ShoppingCartSimpleIcon } from '@/components/icons'

interface MenuItem {
  activeIcon: React.ReactNode
  display?: 'desktop' | 'mobile'
  icon: React.ReactNode
  label: string
  linkProps: LinkProps
}

export const menuItems: MenuItem[] = [
  {
    activeIcon: <HouseIcon className="size-6" weight="fill" />,
    icon: <HouseIcon className="size-6" />,
    label: 'Accueil',
    linkProps: {
      to: '/',
    },
  },
  {
    activeIcon: <MagnifyingGlassIcon className="size-6" weight="bold" />,
    display: 'mobile',
    icon: <MagnifyingGlassIcon className="size-6" />,
    label: 'Rechercher',
    linkProps: {
      to: '/search',
    },
  },
  {
    activeIcon: <ShoppingCartSimpleIcon className="size-6" weight="fill" />,
    icon: <ShoppingCartSimpleIcon className="size-6" />,
    label: 'Courses',
    linkProps: {
      to: '/shopping-list',
    },
  },
  {
    activeIcon: <GearIcon className="size-6" weight="fill" />,
    icon: <GearIcon className="size-6" />,
    label: 'Paramètres',
    linkProps: {
      to: '/settings',
    },
  },
]
