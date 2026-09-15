import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner'

const meta = {
  component: Spinner,
  tags: ['autodocs'],
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
}
