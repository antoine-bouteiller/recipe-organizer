import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Skeleton } from './skeleton'

const meta = {
  component: Skeleton,
  tags: ['autodocs'],
  title: 'Feedback/Skeleton',
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { className: 'h-5 w-48' },
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Skeleton {...args} />
      </StorySection>
      <StorySection title="Recipe Card">
        <div className="w-80 space-y-3 rounded-2xl border p-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </StorySection>
    </div>
  ),
}
