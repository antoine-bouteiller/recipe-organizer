import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Toggle } from './toggle'

const meta = {
  args: { 'aria-label': 'Bold text', children: 'Bold' },
  component: Toggle,
  tags: ['autodocs'],
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Pressed: Story = { args: { defaultPressed: true } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Disabled: Story = { args: { disabled: true } }
