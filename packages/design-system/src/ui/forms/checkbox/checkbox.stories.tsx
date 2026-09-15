import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

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

export const Default: Story = {}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox defaultChecked id="checked-notification" />
      <label htmlFor="checked-notification">Receive email notifications</label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox disabled id="disabled-notification" />
      <label htmlFor="disabled-notification">Receive email notifications</label>
    </div>
  ),
}
