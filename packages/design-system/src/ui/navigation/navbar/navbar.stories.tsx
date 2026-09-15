import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '../../actions/button/button'
import { ThemeIcon } from '../../data-display/icons/theme'
import { Navbar, NavbarItem } from './navbar'

const NavbarExample = (): React.ReactElement => (
  <Navbar
    actions={
      <Button aria-label="Toggle theme" size="icon" variant="ghost">
        <ThemeIcon className="size-6" />
      </Button>
    }
  >
    <NavbarItem href="/" aria-current="page">
      Home
    </NavbarItem>
    <NavbarItem href="/shopping-list">Shopping list</NavbarItem>
  </Navbar>
)

const meta = { component: NavbarExample, tags: ['autodocs'], title: 'Navigation/Navbar' } satisfies Meta<typeof NavbarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
    await expect(activeLink).toHaveClass('aria-[current=page]:text-foreground')
    await expect(canvas.getByRole('button', { name: 'Toggle theme' })).toBeVisible()
  },
}
