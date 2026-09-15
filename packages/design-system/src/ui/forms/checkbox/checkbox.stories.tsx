import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { Checkbox } from './checkbox'

const CheckboxExample = (): ReactElement => {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} id="email-notifications" onCheckedChange={setChecked} />
      <label htmlFor="email-notifications">Receive email notifications</label>
    </div>
  )
}

const meta = {
  component: CheckboxExample,
  tags: ['autodocs'],
  title: 'Forms/Checkbox',
} satisfies Meta<typeof CheckboxExample>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <CheckboxExample />
      </StorySection>
      <StorySection title="Checked">
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="checked-notification" />
          <label htmlFor="checked-notification">Receive email notifications</label>
        </div>
      </StorySection>
      <StorySection title="Disabled">
        <div className="flex items-center gap-2">
          <Checkbox disabled id="disabled-notification" />
          <label htmlFor="disabled-notification">Receive email notifications</label>
        </div>
      </StorySection>
    </div>
  ),
}
