import { type Meta, type StoryObj } from '@storybook/react-vite'

import { NumberInput } from './number-input'

const meta = {
  args: { defaultValue: 2, label: 'Servings', max: 12, min: 0 },
  component: NumberInput,
  tags: ['autodocs'],
  title: 'Forms/Number Input',
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { defaultValue: undefined, label: 'Servings', placeholder: '0' } }
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 20, label: 'Servings', max: 12 } }
export const Disabled: Story = { args: { defaultValue: 2, disabled: true, label: 'Servings' } }
