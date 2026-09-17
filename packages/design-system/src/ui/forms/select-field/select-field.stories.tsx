import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'

import * as styles from './select-field.stories.css'

const items = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const SelectFieldExample = ({ disabled = false, initialValue }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const form = useAppForm({ defaultValues: { status: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="status">
        {({ SelectField: AppSelectField }) => <AppSelectField disabled={disabled} items={items} label="Status" />}
      </form.AppField>
    </form.AppForm>
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
