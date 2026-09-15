import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

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

const meta = { component: NumberField, tags: ['autodocs'], title: 'Forms/NumberField' } satisfies Meta<typeof NumberField>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <NumberFieldExample /> }
export const InitialValue: Story = { render: () => <NumberFieldExample initialValue={4} /> }
export const Disabled: Story = { render: () => <NumberFieldExample disabled initialValue={4} /> }
