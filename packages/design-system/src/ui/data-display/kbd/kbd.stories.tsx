import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Kbd, KbdGroup } from './kbd'

const meta = {
  component: Kbd,
  title: 'Data Display/Kbd',
} satisfies Meta<typeof Kbd>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: '⌘' },
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Kbd {...args} />
      </StorySection>
      <StorySection title="Shortcut">
        <p className="text-sm">
          Save changes with{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>S</Kbd>
          </KbdGroup>
        </p>
      </StorySection>
    </div>
  ),
}
