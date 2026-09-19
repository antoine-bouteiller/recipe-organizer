import { Button } from '@recipe-organizer/design-system/button'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type SubmitEvent, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { Field, FieldControl, FieldError, FieldLabel } from '../field/field'
import { Form } from './form'

const RecipeForm = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field name="recipeName">
        <FieldLabel>Recipe name</FieldLabel>
        <FieldControl required />
        <FieldError match="valueMissing">A recipe name is required.</FieldError>
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
