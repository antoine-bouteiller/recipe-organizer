import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { HouseIcon } from '../../data-display/icons/house'
import { ShoppingCartSimpleIcon } from '../../data-display/icons/shopping-cart-simple'
import { TabBar, TabBarItem } from './tabbar'

import { container } from './tabbar.stories.css'

const TabBarExample = (): React.ReactElement => (
  <div className={container}>
    <TabBar>
      <TabBarItem activeIcon={<HouseIcon weight="fill" />} aria-current="page" href="/" icon={<HouseIcon />}>
        Home
      </TabBarItem>
      <TabBarItem activeIcon={<ShoppingCartSimpleIcon weight="fill" />} href="/shopping-list" icon={<ShoppingCartSimpleIcon />}>
        Shopping
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
    await expect(canvas.getByRole('link', { name: 'Shopping' }).getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth)
  },
}
