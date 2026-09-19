import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Select } from './select'

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

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
