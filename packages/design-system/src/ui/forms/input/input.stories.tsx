import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Input } from './input'

import * as styles from './input.stories.css'

const meta = {
  args: { 'aria-label': 'Email address', placeholder: 'name@example.com', type: 'email' },
  component: Input,
  title: 'Forms/Input',
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (args) => (
    <div className={styles.container}>
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

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox')
    await userEvent.click(inputs[0])
    await expect(inputs[0]).toHaveFocus()
    await userEvent.type(inputs[0], 'cook@example.com')
    await expect(inputs[0]).toHaveValue('cook@example.com')
    await userEvent.click(inputs[2])
    await expect(inputs[2]).toHaveFocus()
    await expect(inputs[2]).toHaveAttribute('aria-invalid', 'true')
    await expect(inputs[3]).toBeDisabled()
  },
  tags: ['!dev'],
}
