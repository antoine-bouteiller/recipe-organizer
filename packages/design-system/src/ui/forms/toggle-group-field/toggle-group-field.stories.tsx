import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { useAppForm } from '../../../hooks/use-app-form'

const emptyMeals: string[] = []

const items = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

const ToggleGroupFieldExample = ({ disabled = false, initialValue = emptyMeals }: { disabled?: boolean; initialValue?: string[] }): ReactElement => {
  const form = useAppForm({ defaultValues: { meals: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="meals">
        {({ ToggleGroupField: AppToggleGroupField }) => <AppToggleGroupField disabled={disabled} items={items} label="Meals" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: ToggleGroupFieldExample, tags: ['autodocs'], title: 'Forms/ToggleGroupField' } satisfies Meta<
  typeof ToggleGroupFieldExample
>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <ToggleGroupFieldExample /> }
export const InitialValue: Story = { render: () => <ToggleGroupFieldExample initialValue={['lunch']} /> }
export const Disabled: Story = { render: () => <ToggleGroupFieldExample disabled initialValue={['lunch']} /> }
