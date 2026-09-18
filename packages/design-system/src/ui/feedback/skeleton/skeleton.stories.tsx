import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Skeleton } from './skeleton'

import * as styles from './skeleton.stories.css'

const meta = {
  component: Skeleton,
  title: 'Feedback/Skeleton',
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { preset: 'recipe-details-text' },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Skeleton {...args} />
      </StorySection>
      <StorySection title="Recipe Card">
        <div className={styles.recipeCardPreview}>
          <Skeleton preset="recipe-card" />
          <Skeleton preset="recipe-details-title" />
          <Skeleton preset="recipe-details-text" />
          <Skeleton preset="recipe-details-text" />
        </div>
      </StorySection>
    </div>
  ),
}
