import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Label } from './label'

const meta = {
  component: Label,
  tags: ['autodocs'],
  title: 'Forms/Label',
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Email address', htmlFor: 'email' },
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label {...args} />
      <input className="h-9 rounded-md border border-input bg-background px-3 text-sm" id="email" placeholder="name@example.com" type="email" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="disabled-email">Email address</Label>
      <input
        className="h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-64"
        disabled
        id="disabled-email"
        value="name@example.com"
      />
    </div>
  ),
}
