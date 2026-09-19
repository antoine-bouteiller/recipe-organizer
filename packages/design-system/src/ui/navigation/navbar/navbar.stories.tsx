import { Button } from '@recipe-organizer/design-system/button'
import { ThemeIcon } from '@recipe-organizer/design-system/icons/theme'
import { withRouter } from '@storybook-helpers/router'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Navbar } from './navbar'

const NavbarExample = (): React.ReactElement => (
  <Navbar
    actions={
      <Button aria-label="Toggle theme" size="icon" variant="ghost">
        <ThemeIcon size="lg" />
      </Button>
    }
    items={[
      { label: 'Home', linkProps: { to: '/' } },
      { label: 'Shopping list', linkProps: { to: '/shopping-list' } },
    ]}
  />
)

const meta = { component: NavbarExample, decorators: [withRouter], title: 'Navigation/Navbar' } satisfies Meta<typeof NavbarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interaction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(activeLink).toHaveAttribute('aria-current', 'page')
  },
  tags: ['!dev'],
}
