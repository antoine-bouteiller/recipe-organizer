import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Badge } from './badge'

import * as styles from './badge.stories.css'

const meta = {
  component: Badge,
  title: 'Data Display/Badge',
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { children: 'New' },
  render: (args) => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Badge {...args} />
      </StorySection>
      <StorySection title="Variants">
        <div className={styles.container2}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="eyebrow">Featured</Badge>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={styles.container3}>
          <Badge size="sm">Small</Badge>
          <Badge>Default</Badge>
        </div>
      </StorySection>
    </div>
  ),
}
