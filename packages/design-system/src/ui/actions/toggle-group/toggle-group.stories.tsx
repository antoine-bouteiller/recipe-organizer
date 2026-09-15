import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { ToggleGroup } from './toggle-group'

const items = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

const ControlledToggleGroup = (): ReactElement => {
  const [value, setValue] = useState<string[]>(['breakfast'])
  return <ToggleGroup items={items} onValueChange={setValue} value={value} />
}

const meta = {
  args: { items, onValueChange: () => undefined, value: [] },
  component: ToggleGroup,
  tags: ['autodocs'],
  title: 'Actions/Toggle Group',
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <ControlledToggleGroup /> }
export const Empty: Story = { args: { items: [], onValueChange: () => undefined, value: [] } }
export const Disabled: Story = { args: { disabled: true, items, onValueChange: () => undefined, value: ['lunch'] } }
