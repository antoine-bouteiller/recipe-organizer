import { Button } from '@recipe-organizer/design-system/button'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Card } from './card'

import * as styles from './card.stories.css'

const meta = {
  component: Card,
  title: 'Data Display/Card',
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: {
    children: <div className={styles.container}>Card content goes here.</div>,
    description: 'A concise description of this content.',
    title: 'Recipe details',
  },
  render: (args) => (
    <div className={styles.storyLayout}>
      <StorySection title="Default">
        <Card {...args} />
      </StorySection>
      <StorySection title="With Actions">
        <Card description="Changes are saved automatically." title="Profile settings">
          <div className={styles.actionRow}>
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>
      </StorySection>
      <StorySection title="Content Only">
        <Card>
          <div className={styles.contentPadding}>A card can be used without a header.</div>
        </Card>
      </StorySection>
    </div>
  ),
}
