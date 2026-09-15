import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { useAppForm } from '../../../hooks/use-app-form'

const FormSubmitExample = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false)
  const form = useAppForm({ defaultValues: { name: 'Tomato soup' }, onSubmit: async () => setSubmitted(true) })

  return (
    <form.AppForm>
      <form.AppField name="name">{({ TextField }) => <TextField label="Recipe name" />}</form.AppField>
      <form.FormSubmit label="Save recipe" />
      {submitted && <p role="status">Recipe saved.</p>}
    </form.AppForm>
  )
}

const meta = { component: FormSubmitExample, title: 'Forms/FormSubmit' } satisfies Meta<typeof FormSubmitExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <FormSubmitExample /> }
