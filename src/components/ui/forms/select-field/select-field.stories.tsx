import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { FormErrorsContext } from '../form/form'
import { SelectField } from './select-field'

import * as styles from './select-field.stories.css'

const items = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const SelectFieldExample = ({ disabled = false, initialValue }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const [value, setValue] = useState<string | null | undefined>(initialValue)
  return (
    <FormErrorsContext value={{}}>
      <SelectField name="status" value={value} onChange={setValue} disabled={disabled} items={items} label="Status" />
    </FormErrorsContext>
  )
}

const meta = { component: SelectFieldExample, title: 'Forms/SelectField' } satisfies Meta<typeof SelectFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <SelectFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <SelectFieldExample initialValue="published" />
      </StorySection>
      <StorySection title="Disabled">
        <SelectFieldExample disabled initialValue="draft" />
      </StorySection>
    </div>
  ),
}
