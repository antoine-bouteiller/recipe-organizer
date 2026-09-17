import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { Select } from './select'
import SelectBase from './select.base'
import SelectDrawer from './select.drawer'

import * as styles from './select.stories.css'

const items = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
] as const

type Status = (typeof items)[number]['value']

const ControlledSelect = (): ReactElement => {
  const [value, setValue] = useState<Status | null>(null)
  return <Select items={[...items]} onValueChange={setValue} placeholder="Choose a status" title="Status" value={value} />
}

const ControlledBase = (): ReactElement => {
  const [value, setValue] = useState<Status | null>(null)
  return <SelectBase items={[...items]} onValueChange={setValue} placeholder="Choose a status" title="Status" value={value} />
}

const ControlledDrawer = (): ReactElement => {
  const [value, setValue] = useState<Status | null>(null)
  return <SelectDrawer items={[...items]} onValueChange={setValue} placeholder="Choose a status" title="Status" value={value} />
}

const ControlledMultiple = (): ReactElement => {
  const [value, setValue] = useState<Status[]>(['draft'])
  return <Select items={[...items]} multiple onValueChange={setValue} placeholder="Choose statuses" title="Statuses" value={value} />
}

const meta = {
  args: { items: [...items], onValueChange: () => undefined, value: null },
  component: Select,
  title: 'Forms/Select',
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Responsive">
        <ControlledSelect />
      </StorySection>
      <StorySection title="Desktop">
        <ControlledBase />
      </StorySection>
      <StorySection title="Drawer">
        <ControlledDrawer />
      </StorySection>
      <StorySection title="Multiple">
        <ControlledMultiple />
      </StorySection>
      <StorySection title="Disabled">
        <Select disabled items={[...items]} onValueChange={() => undefined} value="draft" />
      </StorySection>
      <StorySection title="Empty">
        <Select items={[]} onValueChange={() => undefined} placeholder="No statuses available" value={null} />
      </StorySection>
    </div>
  ),
}
