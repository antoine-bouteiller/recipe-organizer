import { PlusIcon } from '@recipe-organizer/design-system/icons/plus'
import { withRouter } from '@storybook-helpers/router'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { FloatingAction } from './floating-action'

const meta = {
  args: { children: <PlusIcon size="xl" />, label: 'Add item', linkProps: { to: '/new', viewTransition: true } },
  component: FloatingAction,
  decorators: [withRouter],
  parameters: { layout: 'fullscreen' },
  title: 'Actions/Floating Action',
} satisfies Meta<typeof FloatingAction>

export default meta
type Story = StoryObj<typeof meta>

export const Mobile: Story = {
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Add item' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/new')
  },
}
