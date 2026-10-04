<script module lang="ts">
  import type { Snippet } from 'svelte'

  import { GearIcon, HouseIcon, MagnifyingGlassIcon, ShoppingCartSimpleIcon } from '@/components/ui/data-display/icons'

  export interface MenuItem {
    activeIcon: Snippet
    display?: 'desktop' | 'mobile'
    href: '/' | '/search' | '/shopping-list' | '/settings'
    icon: Snippet
    label: string
  }

  const menuItems: MenuItem[] = [
    { activeIcon: houseActive, href: '/', icon: house, label: 'Accueil' },
    { activeIcon: searchActive, display: 'mobile', href: '/search', icon: search, label: 'Rechercher' },
    { activeIcon: cartActive, href: '/shopping-list', icon: cart, label: 'Courses' },
    { activeIcon: gearActive, href: '/settings', icon: gear, label: 'Paramètres' },
  ]

  export const desktopMenuItems = menuItems.filter((item) => item.display !== 'mobile')
  export const mobileMenuItems = menuItems.filter((item) => item.display !== 'desktop')
</script>

{#snippet house()}<HouseIcon />{/snippet}
{#snippet houseActive()}<HouseIcon weight="fill" />{/snippet}
{#snippet search()}<MagnifyingGlassIcon />{/snippet}
{#snippet searchActive()}<MagnifyingGlassIcon weight="bold" />{/snippet}
{#snippet cart()}<ShoppingCartSimpleIcon />{/snippet}
{#snippet cartActive()}<ShoppingCartSimpleIcon weight="fill" />{/snippet}
{#snippet gear()}<GearIcon />{/snippet}
{#snippet gearActive()}<GearIcon weight="fill" />{/snippet}
