import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'

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
        <div className={styles.variantOptions}>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="info-subtle">Info subtle</Badge>
          <Badge variant="destructive-subtle">Destructive subtle</Badge>
          <Badge variant="neutral-subtle">Neutral subtle</Badge>
          <Badge variant="success-subtle">Success subtle</Badge>
          <Badge variant="warning-subtle">Warning subtle</Badge>
        </div>
      </StorySection>
      <StorySection title="Sizes">
        <div className={styles.sizeOptions}>
          <Badge size="sm">Small</Badge>
          <Badge>Default</Badge>
        </div>
      </StorySection>
    </div>
  ),
}
