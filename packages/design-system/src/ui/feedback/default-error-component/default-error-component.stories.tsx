import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { Button } from '../../actions/button/button'
import { DefaultErrorComponent } from './default-error-component'

const meta = {
  args: {
    action: <Button render={<a href="#retry" />}>Try again</Button>,
  },
  component: DefaultErrorComponent,
  tags: ['autodocs'],
  title: 'Feedback/Default Error Component',
} satisfies Meta<typeof DefaultErrorComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvasElement.querySelector('code')).not.toBeInTheDocument()
  },
}

export const WithDetails: Story = {
  args: { details: 'A caller-provided diagnostic message.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('A caller-provided diagnostic message.')).toBeVisible()
  },
}
