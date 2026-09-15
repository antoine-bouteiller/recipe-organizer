import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { useAppForm } from '../../../hooks/use-app-form'
import { TextField } from './text-field'

const TextFieldExample = ({ disabled = false, initialValue = '' }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const form = useAppForm({ defaultValues: { title: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="title">
        {({ TextField: AppTextField }) => <AppTextField disabled={disabled} label="Recipe title" placeholder="Tomato soup" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: TextField, tags: ['autodocs'], title: 'Forms/TextField' } satisfies Meta<typeof TextField>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Recipe title' })
    await userEvent.type(input, 'Tomato soup')
    await expect(input).toHaveValue('Tomato soup')
  },
  render: () => <TextFieldExample />,
}
export const InitialValue: Story = { render: () => <TextFieldExample initialValue="Tomato soup" /> }
export const Disabled: Story = { render: () => <TextFieldExample disabled initialValue="Tomato soup" /> }
