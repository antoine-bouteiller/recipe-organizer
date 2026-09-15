import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { useAppForm } from '../../../hooks/use-app-form'

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

const meta = { component: SelectFieldExample, tags: ['autodocs'], title: 'Forms/SelectField' } satisfies Meta<typeof SelectFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <SelectFieldExample /> }
export const InitialValue: Story = { render: () => <SelectFieldExample initialValue="published" /> }
export const Disabled: Story = { render: () => <SelectFieldExample disabled initialValue="draft" /> }
