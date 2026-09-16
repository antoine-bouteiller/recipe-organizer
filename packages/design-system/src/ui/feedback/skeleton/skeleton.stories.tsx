import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Skeleton } from './skeleton'

import { container, container2 } from './skeleton.stories.css'

const meta = {
  component: Skeleton,
  title: 'Feedback/Skeleton',
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { preset: 'recipe-details-text' },
  render: (args) => (
    <div className={container}>
      <StorySection title="Default">
        <Skeleton {...args} />
      </StorySection>
      <StorySection title="Recipe Card">
        <div className={container2}>
          <Skeleton preset="recipe-card" />
          <Skeleton preset="recipe-details-title" />
          <Skeleton preset="recipe-details-text" />
          <Skeleton preset="recipe-details-text" />
        </div>
      </StorySection>
    </div>
  ),
}
