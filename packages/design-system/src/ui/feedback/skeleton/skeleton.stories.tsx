import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Skeleton } from './skeleton'

const meta = {
  component: Skeleton,
  title: 'Feedback/Skeleton',
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { preset: 'recipe-details-text' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Skeleton {...args} />
      </StorySection>
      <StorySection title="Recipe Card">
        <div
          className={css({
            '& > * + *': { marginTop: '3' },
            borderColor: 'border',
            borderRadius: '2xl',
            borderWidth: '1px',
            padding: '4',
            width: '80',
          })}
        >
          <Skeleton preset="recipe-card" />
          <Skeleton preset="recipe-details-title" />
          <Skeleton preset="recipe-details-text" />
          <Skeleton preset="recipe-details-text" />
        </div>
      </StorySection>
    </div>
  ),
}
