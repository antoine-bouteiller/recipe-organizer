import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Spinner } from './spinner'

import { container, container2 } from './spinner.stories.css'

const meta = {
  component: Spinner,
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={container}>
      <StorySection title="Default">
        <Spinner />
      </StorySection>
      <StorySection title="Sizes">
        <div className={container2}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </StorySection>
    </div>
  ),
}
