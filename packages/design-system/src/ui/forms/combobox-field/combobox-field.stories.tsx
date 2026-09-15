import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
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
export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <ComboboxFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <ComboboxFieldExample initialValue="dinner" />
      </StorySection>
      <StorySection title="Disabled">
        <ComboboxFieldExample disabled initialValue="breakfast" />
      </StorySection>
    </div>
  ),
}
