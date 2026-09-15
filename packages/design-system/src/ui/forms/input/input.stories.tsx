import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Input } from './input'

const meta = {
  args: { 'aria-label': 'Email address', placeholder: 'name@example.com', type: 'email' },
  component: Input,
  tags: ['autodocs'],
  title: 'Forms/Input',
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { placeholder: 'Enter your email' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'not-an-email', type: 'email' } }
export const Disabled: Story = { args: { defaultValue: 'name@example.com', disabled: true } }
