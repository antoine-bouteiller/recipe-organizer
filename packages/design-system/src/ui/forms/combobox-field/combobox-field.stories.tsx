import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import * as styles from './combobox-field.stories.css'

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

const meta = { component: ComboboxFieldExample, title: 'Forms/ComboboxField' } satisfies Meta<typeof ComboboxFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
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
