import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
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
  title: 'Actions/Toggle Group',
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <ControlledToggleGroup />
      </StorySection>
      <StorySection title="Empty">
        <ToggleGroup {...args} items={[]} />
      </StorySection>
      <StorySection title="Disabled">
        <ToggleGroup {...args} disabled items={items} value={['lunch']} />
      </StorySection>
    </div>
  ),
}
