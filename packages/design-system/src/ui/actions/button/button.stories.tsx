import { type Meta, type StoryObj } from '@storybook/react-vite'

import { PlusIcon } from '../../data-display/icons/plus'
import { Button } from './button'

const meta = {
  component: Button,
  tags: ['autodocs'],
  title: 'Actions/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Save changes' },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="destructive-outline">Remove</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
      <Button aria-label="Add item" size="icon">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
}

export const Loading: Story = {
  args: { children: 'Saving changes', loading: true },
}
