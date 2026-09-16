import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '../../actions/button/button'
import { ThemeIcon } from '../../data-display/icons/theme'
import { Navbar, NavbarItem } from './navbar'

const NavbarExample = (): React.ReactElement => (
  <Navbar
    actions={
      <Button aria-label="Toggle theme" size="icon" variant="ghost">
        <ThemeIcon size="lg" />
      </Button>
    }
  >
    <NavbarItem href="/" aria-current="page">
      Home
    </NavbarItem>
    <NavbarItem href="/shopping-list">Shopping list</NavbarItem>
  </Navbar>
)

const meta = { component: NavbarExample, title: 'Navigation/Navbar' } satisfies Meta<typeof NavbarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await expect(activeLink).toHaveAttribute('data-slot', 'navbar-item')
    await expect(canvas.getByRole('button', { name: 'Toggle theme' })).toBeVisible()
  },
}
