import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { SubmitEvent, ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Button } from '@/components/ui/actions/button/button'

import { Field, FieldError, FieldLabel } from '../field/field'
import { Input } from '../input/input'
import { Form } from './form'

const RecipeForm = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false)
  const [recipeName, setRecipeName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setErrors(recipeName ? {} : { recipeName: 'A recipe name is required.' })
    setSubmitted(Boolean(recipeName))
  }

  return (
    <Form errors={errors} onSubmit={handleSubmit}>
      <Field name="recipeName">
        <FieldLabel htmlFor="recipeName">Recipe name</FieldLabel>
        <Input id="recipeName" onChange={(event) => setRecipeName(event.target.value)} value={recipeName} />
        <FieldError />
      </Field>
      <Button type="submit">Save recipe</Button>
      {submitted && <p role="status">Recipe saved.</p>}
    </Form>
  )
}

const meta = {
  component: Form,
  title: 'Forms/Form',
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <RecipeForm />,
}

export const ValidationAndSubmission: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Save recipe' }))
    await expect(canvas.getByText('A recipe name is required.')).toBeVisible()
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Recipe name' }), 'Tomato soup')
    await userEvent.click(canvas.getByRole('button', { name: 'Save recipe' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Recipe saved.')
  },
  tags: ['!dev'],
}
