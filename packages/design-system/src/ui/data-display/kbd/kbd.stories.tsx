import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Kbd, KbdGroup } from './kbd'

const meta = {
  component: Kbd,
  tags: ['autodocs'],
  title: 'Data Display/Kbd',
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: '⌘' },
}

export const Shortcut: Story = {
  render: () => (
    <p className="text-sm">
      Save changes with{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>
    </p>
  ),
}
