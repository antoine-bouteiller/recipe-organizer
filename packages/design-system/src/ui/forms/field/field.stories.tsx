import { type Meta, type StoryObj } from '@storybook/react-vite'

import { Input } from '../input/input'
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from './field'

const meta = {
  component: Field,
  tags: ['autodocs'],
  title: 'Forms/Field',
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field name="email">
      <FieldLabel>Email address</FieldLabel>
      <FieldControl render={<Input placeholder="name@example.com" type="email" />} />
      <FieldDescription>We will only use this to contact you about your account.</FieldDescription>
    </Field>
  ),
}

export const Invalid: Story = {
  render: () => (
    <Field invalid name="email">
      <FieldLabel>Email address</FieldLabel>
      <FieldControl render={<Input aria-invalid placeholder="name@example.com" type="email" />} />
      <FieldDescription>Enter the address associated with your account.</FieldDescription>
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field disabled name="email">
      <FieldLabel>Email address</FieldLabel>
      <FieldControl render={<Input disabled defaultValue="name@example.com" type="email" />} />
      <FieldDescription>This field is unavailable while the account is locked.</FieldDescription>
    </Field>
  ),
}
