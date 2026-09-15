import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { NumberField } from './number-field'

const NumberFieldExample = ({ disabled = false, initialValue }: { disabled?: boolean; initialValue?: number }): ReactElement => {
  const form = useAppForm({ defaultValues: { servings: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="servings">
        {({ NumberField: AppNumberField }) => <AppNumberField disabled={disabled} label="Servings" min={1} placeholder="4" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: NumberField, title: 'Forms/NumberField' } satisfies Meta<typeof NumberField>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <NumberFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <NumberFieldExample initialValue={4} />
      </StorySection>
      <StorySection title="Disabled">
        <NumberFieldExample disabled initialValue={4} />
      </StorySection>
    </div>
  ),
}
