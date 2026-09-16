import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Spinner } from './spinner'

const meta = {
  component: Spinner,
  title: 'Feedback/Spinner',
} satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })}>
      <StorySection title="Default">
        <Spinner />
      </StorySection>
      <StorySection title="Sizes">
        <div className={css({ alignItems: 'center', display: 'flex', gap: '4' })}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </StorySection>
    </div>
  ),
}
