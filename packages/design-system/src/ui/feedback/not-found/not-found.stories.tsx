import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { NotFound } from './not-found'

import { container } from './not-found.stories.css'

const meta = {
  args: { action: <Button render={<a href="#home" />}>Return home</Button> },
  component: NotFound,
  title: 'Feedback/Not Found',
} satisfies Meta<typeof NotFound>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={container}>
      <StorySection title="Default">
        <NotFound {...args} />
      </StorySection>
      <StorySection title="Without Action">
        <NotFound {...args} action={undefined} />
      </StorySection>
    </div>
  ),
}
