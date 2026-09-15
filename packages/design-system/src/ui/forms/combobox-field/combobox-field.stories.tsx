import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { useAppForm } from '../../../hooks/use-app-form'

const options = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

const ComboboxFieldExample = ({ disabled = false, initialValue }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const form = useAppForm({ defaultValues: { meal: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="meal">
        {({ ComboboxField: AppComboboxField }) => <AppComboboxField disabled={disabled} label="Meal" options={options} />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: ComboboxFieldExample, tags: ['autodocs'], title: 'Forms/ComboboxField' } satisfies Meta<typeof ComboboxFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <ComboboxFieldExample /> }
export const InitialValue: Story = { render: () => <ComboboxFieldExample initialValue="dinner" /> }
export const Disabled: Story = { render: () => <ComboboxFieldExample disabled initialValue="breakfast" /> }
