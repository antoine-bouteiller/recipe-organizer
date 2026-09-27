import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import type { ReactElement } from 'react'

import type { Option } from './options'

import * as styles from './combobox-field.stories.css'

const options = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

interface ComboboxFieldExampleProps {
  disabled?: boolean
  initialValue?: string
  invalid?: boolean
  options?: Option<string>[]
}

const ComboboxFieldExample = ({
  disabled = false,
  initialValue,
  invalid = false,
  options: items = options,
}: ComboboxFieldExampleProps): ReactElement => {
  const form = useAppForm({ defaultValues: { meal: initialValue }, onSubmit: async () => undefined })
  // Invalid combobox styling appears once the field is touched, as after a submit attempt.
  useEffect(() => {
    if (invalid) {
      void form.handleSubmit()
    }
  }, [form, invalid])

  return (
    <form.AppForm>
      <form.AppField name="meal" validators={invalid ? { onSubmit: () => 'Invalid' } : undefined}>
        {({ ComboboxField }) => <ComboboxField disabled={disabled} label="Meal" options={items} />}
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
      <StorySection title="Invalid">
        <ComboboxFieldExample invalid />
      </StorySection>
      <StorySection title="Disabled">
        <ComboboxFieldExample disabled initialValue="breakfast" />
      </StorySection>
      <StorySection title="Empty">
        <ComboboxFieldExample options={[]} />
      </StorySection>
    </div>
  ),
}

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
