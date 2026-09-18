import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Separator } from './separator'

import * as styles from './separator.stories.css'

const meta = {
  component: Separator,
  title: 'Layout/Separator',
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <div className={styles.container2}>
          <p className={styles.text}>Ingredients</p>
          <div className={styles.container3}>
            <Separator />
          </div>
          <p className={styles.text2}>Serves four people.</p>
        </div>
      </StorySection>
      <StorySection title="Vertical">
        <div className={styles.container4}>
          <span>Overview</span>
          <Separator orientation="vertical" />
          <span>Details</span>
        </div>
      </StorySection>
    </div>
  ),
}
