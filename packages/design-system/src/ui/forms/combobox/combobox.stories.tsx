import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Combobox } from './combobox'
import ComboboxBase from './combobox.base'
import ComboboxDrawer from './combobox.drawer'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

const ControlledCombobox = (): ReactElement => {
  const [value, setValue] = useState<string | undefined>()
  return <Combobox onChange={(option) => setValue(option?.value)} options={options} value={value} />
}

const ControlledBase = (): ReactElement => {
  const [value, setValue] = useState<string | undefined>()
  const selectedOption = options.find((option) => option.value === value)
  return (
    <ComboboxBase
      isInvalid={false}
      onChange={(option) => setValue(option?.value)}
      options={options}
      placeholder="Choose a fruit"
      searchPlaceholder="Search fruits"
      selectedOption={selectedOption}
      title="Choose a fruit"
    />
  )
}

const ControlledDrawer = (): ReactElement => {
  const [value, setValue] = useState<string | undefined>()
  const selectedOption = options.find((option) => option.value === value)
  return (
    <ComboboxDrawer
      isInvalid={false}
      onChange={(option) => setValue(option?.value)}
      options={options}
      placeholder="Choose a fruit"
      searchPlaceholder="Search fruits"
      selectedOption={selectedOption}
      title="Choose a fruit"
    />
  )
}

const meta = {
  args: { onChange: () => undefined, options, value: undefined },
  component: Combobox,
  tags: ['autodocs'],
  title: 'Forms/Combobox',
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Responsive: Story = { render: () => <ControlledCombobox /> }
export const Desktop: Story = { render: () => <ControlledBase /> }
export const Drawer: Story = { render: () => <ControlledDrawer /> }
export const Invalid: Story = {
  render: () => <Combobox isInvalid onChange={() => undefined} options={options} placeholder="Choose a fruit" value={undefined} />,
}
export const Disabled: Story = { render: () => <Combobox disabled onChange={() => undefined} options={options} value="apple" /> }
export const Empty: Story = { render: () => <Combobox onChange={() => undefined} options={[]} placeholder="No fruits available" value={undefined} /> }
