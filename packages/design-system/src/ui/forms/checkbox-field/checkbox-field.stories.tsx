import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { useAppForm } from '../../../hooks/use-app-form'
import { CheckboxField } from './checkbox-field'

const CheckboxFieldExample = ({ disabled = false, initialValue = false }: { disabled?: boolean; initialValue?: boolean }): ReactElement => {
  const form = useAppForm({ defaultValues: { published: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="published">
        {({ CheckboxField: AppCheckboxField }) => <AppCheckboxField disabled={disabled} label="Published" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: CheckboxField, tags: ['autodocs'], title: 'Forms/CheckboxField' } satisfies Meta<typeof CheckboxField>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Published' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
  render: () => <CheckboxFieldExample />,
}
export const Checked: Story = { render: () => <CheckboxFieldExample initialValue /> }
export const Disabled: Story = { render: () => <CheckboxFieldExample disabled initialValue /> }
