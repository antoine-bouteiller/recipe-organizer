import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Input } from './input'

const meta = {
  args: { 'aria-label': 'Email address', placeholder: 'name@example.com', type: 'email' },
  component: Input,
  title: 'Forms/Input',
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: 0, width: 'full' })}>
      <StorySection title="Default">
        <Input {...args} />
      </StorySection>
      <StorySection title="Empty">
        <Input {...args} placeholder="Enter your email" />
      </StorySection>
      <StorySection title="Invalid">
        <Input {...args} aria-invalid defaultValue="not-an-email" type="email" />
      </StorySection>
      <StorySection title="Disabled">
        <Input {...args} defaultValue="name@example.com" disabled />
      </StorySection>
    </div>
  ),
}
