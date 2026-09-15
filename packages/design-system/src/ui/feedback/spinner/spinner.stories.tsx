import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Spinner } from './spinner'

const meta = {
  component: Spinner,
  tags: ['autodocs'],
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Spinner />
      </StorySection>
      <StorySection title="Sizes">
        <div className="flex items-center gap-4">
          <Spinner className="size-4" />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </div>
      </StorySection>
    </div>
  ),
}
