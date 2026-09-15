import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { PlusIcon } from '../../data-display/icons/plus'
import { Button } from './button'

const meta = {
  component: Button,
  tags: ['autodocs'],
  title: 'Actions/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'Save changes' },
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Button {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive-outline">Remove</Button>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button aria-label="Add item" size="icon">
            <PlusIcon />
          </Button>
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <Button disabled>Unavailable</Button>
      </StorySection>
    </div>
  ),
}
