import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Combobox } from './combobox'
import ComboboxBase from './combobox.base'
import ComboboxDrawer from './combobox.drawer'

import * as styles from './combobox.stories.css'

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
  title: 'Forms/Combobox',
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Responsive">
        <ControlledCombobox />
      </StorySection>
      <StorySection title="Desktop">
        <ControlledBase />
      </StorySection>
      <StorySection title="Drawer">
        <ControlledDrawer />
      </StorySection>
      <StorySection title="Invalid">
        <Combobox isInvalid onChange={() => undefined} options={options} placeholder="Choose a fruit" value={undefined} />
      </StorySection>
      <StorySection title="Disabled">
        <Combobox disabled onChange={() => undefined} options={options} value="apple" />
      </StorySection>
      <StorySection title="Empty">
        <Combobox onChange={() => undefined} options={[]} placeholder="No fruits available" value={undefined} />
      </StorySection>
    </div>
  ),
}
