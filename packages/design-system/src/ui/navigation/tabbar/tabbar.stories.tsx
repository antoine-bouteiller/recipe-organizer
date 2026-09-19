import { GearIcon } from '@recipe-organizer/design-system/icons/gear'
import { HouseIcon } from '@recipe-organizer/design-system/icons/house'
import { MagnifyingGlassIcon } from '@recipe-organizer/design-system/icons/magnifying-glass'
import { ShoppingCartSimpleIcon } from '@recipe-organizer/design-system/icons/shopping-cart-simple'
import { withRouter } from '@storybook-helpers/router'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { TabBar } from './tabbar'

import * as styles from './tabbar.stories.css'

const TabBarExample = (): React.ReactElement => (
  <div className={styles.container}>
    <main className={styles.appSurface}>
      <span>App surface</span>
      <section className={styles.contentSurface}>Content surface</section>
    </main>
    <TabBar
      items={[
        { activeIcon: <HouseIcon weight="fill" />, icon: <HouseIcon />, label: 'Home', linkProps: { to: '/' } },
        {
          activeIcon: <ShoppingCartSimpleIcon weight="fill" />,
          icon: <ShoppingCartSimpleIcon />,
          label: 'Shopping',
          linkProps: { to: '/shopping-list' },
        },
        { activeIcon: <MagnifyingGlassIcon weight="bold" />, icon: <MagnifyingGlassIcon />, label: 'Search', linkProps: { to: '/search' } },
        { activeIcon: <GearIcon weight="fill" />, icon: <GearIcon />, label: 'Settings', linkProps: { to: '/settings' } },
      ]}
    />
  </div>
)

const meta = { component: TabBarExample, decorators: [withRouter], title: 'Navigation/TabBar' } satisfies Meta<typeof TabBarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  parameters: { layout: 'fullscreen' },
}

export const Interaction: Story = {
  ...Mobile,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })
    const shoppingLink = canvas.getByRole('link', { name: 'Shopping' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await userEvent.tab()
    await expect(activeLink).toHaveFocus()

    await userEvent.click(shoppingLink)
    await expect(shoppingLink).toHaveAttribute('aria-current', 'page')

    await userEvent.click(activeLink)
    await expect(activeLink).toHaveAttribute('aria-current', 'page')
  },
  tags: ['!dev'],
}
