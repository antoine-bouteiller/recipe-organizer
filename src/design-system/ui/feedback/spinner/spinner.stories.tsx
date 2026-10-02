import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Spinner } from './spinner'

import * as styles from './spinner.stories.css'

const meta = {
  component: Spinner,
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <Spinner />
      </StorySection>
    </div>
  ),
}
