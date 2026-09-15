import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Button } from '../../actions/button/button'
import { NotFound } from './not-found'

const meta = {
  args: { action: <Button render={<a href="#home" />}>Return home</Button> },
  component: NotFound,
  tags: ['autodocs'],
  title: 'Feedback/Not Found',
} satisfies Meta<typeof NotFound>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <NotFound {...args} />
      </StorySection>
      <StorySection title="Without Action">
        <NotFound {...args} action={undefined} />
      </StorySection>
    </div>
  ),
}
