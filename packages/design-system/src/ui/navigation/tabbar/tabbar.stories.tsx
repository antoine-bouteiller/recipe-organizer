import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { GearIcon } from '../../data-display/icons/gear'
import { HouseIcon } from '../../data-display/icons/house'
import { MagnifyingGlassIcon } from '../../data-display/icons/magnifying-glass'
import { ShoppingCartSimpleIcon } from '../../data-display/icons/shopping-cart-simple'
import { TabBar, TabBarItem } from './tabbar'

import { accentForeground, accentSurface, appSurface, container, contentSurface, mutedForeground } from './tabbar.stories.css'

const TabBarExample = (): React.ReactElement => (
  <div className={container}>
    <main className={appSurface}>
      <span>App surface</span>
      <section className={contentSurface}>Content surface</section>
      <span className={mutedForeground} data-slot="muted-foreground">
        Muted foreground role
      </span>
      <span className={accentForeground} data-slot="accent-foreground">
        Accent foreground role
      </span>
      <span className={accentSurface} data-slot="accent-surface">
        Accent surface role
      </span>
    </main>
    <TabBar>
      <TabBarItem activeIcon={<HouseIcon weight="fill" />} aria-current="page" href="/" icon={<HouseIcon />}>
        Home
      </TabBarItem>
      <TabBarItem activeIcon={<ShoppingCartSimpleIcon weight="fill" />} href="/shopping-list" icon={<ShoppingCartSimpleIcon />}>
        Shopping
      </TabBarItem>
      <TabBarItem activeIcon={<MagnifyingGlassIcon weight="bold" />} href="/search" icon={<MagnifyingGlassIcon />}>
        Search
      </TabBarItem>
      <TabBarItem activeIcon={<GearIcon weight="fill" />} href="/settings" icon={<GearIcon />}>
        Settings
      </TabBarItem>
    </TabBar>
  </div>
)

const meta = { component: TabBarExample, title: 'Navigation/TabBar' } satisfies Meta<typeof TabBarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await expect(activeLink).toHaveAttribute('data-slot', 'tab-bar-item')
    await expect(canvas.getByRole('link', { name: 'Settings' }).getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth)
    const shoppingLink = canvas.getByRole('link', { name: 'Shopping' })
    const tabBar = canvas.getByRole('navigation')
    const appSurfaceElement = canvas.getByRole('main')
    const activeIcon = activeLink.querySelector<HTMLElement>('[data-slot=tab-bar-item-icon-active]')
    if (!activeIcon) {
      throw new Error('TabBar requires an active icon slot')
    }
    const mutedForegroundProbe = canvas.getByText('Muted foreground role')
    const accentForegroundProbe = canvas.getByText('Accent foreground role')
    const accentSurfaceProbe = canvas.getByText('Accent surface role')

    await expect(getComputedStyle(tabBar).backgroundColor).toBe(getComputedStyle(appSurfaceElement).backgroundColor)
    await waitFor(() => expect(getComputedStyle(activeLink).color).toBe(getComputedStyle(accentForegroundProbe).color))
    await waitFor(() => expect(getComputedStyle(shoppingLink).color).toBe(getComputedStyle(mutedForegroundProbe).color))
    await expect(getComputedStyle(activeIcon).backgroundColor).toBe(getComputedStyle(accentSurfaceProbe).backgroundColor)
    await expect(activeIcon).toBeVisible()
    await expect(activeLink.querySelector('[data-slot=tab-bar-item-icon-inactive]')).not.toBeVisible()
    await expect(shoppingLink.querySelector('[data-slot=tab-bar-item-icon-active]')).not.toBeVisible()
    await expect(shoppingLink.querySelector('[data-slot=tab-bar-item-icon-inactive]')).toBeVisible()
    await userEvent.tab()
    await expect(activeLink).toHaveFocus()
    await expect(getComputedStyle(activeLink).outlineStyle).toBe('solid')
  },
}

export const MobileDark: Story = {
  ...Mobile,
  globals: { ...Mobile.globals, theme: 'dark' },
}
