import { type Meta, type StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
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
  play: async ({ canvasElement }) => {
    const inputs = within(canvasElement).getAllByRole('textbox')
    const controls = canvasElement.querySelectorAll('[data-slot="input-control"]')
    await expect(getComputedStyle(inputs[0]).borderRadius).toBe(getComputedStyle(controls[0]).borderRadius)
    await expect(getComputedStyle(controls[3]).boxShadow).toBe('none')
    await userEvent.click(inputs[0])
    await waitFor(() => expect(getComputedStyle(controls[0]).boxShadow).toContain('0px 0px 0px 3px'))
    const focusShadow = getComputedStyle(controls[0]).boxShadow
    await userEvent.click(inputs[2])
    await waitFor(() => expect(getComputedStyle(controls[2]).boxShadow).toContain('0px 0px 0px 3px'))
    await expect(getComputedStyle(controls[2]).boxShadow).not.toBe(focusShadow)
    await expect(inputs[3]).toBeDisabled()
  },
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
