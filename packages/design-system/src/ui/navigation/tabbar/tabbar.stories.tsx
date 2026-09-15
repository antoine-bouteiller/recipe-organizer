import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { HouseIcon } from '../../data-display/icons/house'
import { ShoppingCartSimpleIcon } from '../../data-display/icons/shopping-cart-simple'
import { TabBar, TabBarItem } from './tabbar'

const TabBarExample = (): React.ReactElement => (
  <div className="relative h-24">
    <TabBar>
      <TabBarItem activeIcon={<HouseIcon className="size-6" weight="fill" />} aria-current="page" href="/" icon={<HouseIcon className="size-6" />}>
        Home
      </TabBarItem>
      <TabBarItem
        activeIcon={<ShoppingCartSimpleIcon className="size-6" weight="fill" />}
        href="/shopping-list"
        icon={<ShoppingCartSimpleIcon className="size-6" />}
      >
        Shopping
      </TabBarItem>
    </TabBar>
  </div>
)

const meta = { component: TabBarExample, tags: ['autodocs'], title: 'Navigation/TabBar' } satisfies Meta<typeof TabBarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await expect(activeLink).toHaveClass('aria-[current=page]:text-primary')
  },
}
