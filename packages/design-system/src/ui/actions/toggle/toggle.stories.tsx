import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Toggle } from './toggle'

const meta = {
  args: { 'aria-label': 'Bold text', children: 'Bold' },
  component: Toggle,
  tags: ['autodocs'],
  title: 'Actions/Toggle',
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Toggle {...args} />
      </StorySection>
      <StorySection title="Pressed">
        <Toggle {...args} defaultPressed />
      </StorySection>
      <StorySection title="Outline">
        <Toggle {...args} variant="outline" />
      </StorySection>
      <StorySection title="Disabled">
        <Toggle {...args} disabled />
      </StorySection>
    </div>
  ),
}
