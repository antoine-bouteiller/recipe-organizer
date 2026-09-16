import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Input } from '../input/input'
import { Field, FieldError, FieldLabel } from './field'

import { container } from './field.stories.css'

const meta = {
  component: Field,
  title: 'Forms/Field',
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={container}>
      <StorySection title="Default">
        <Field name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input placeholder="name@example.com" type="email" />
        </Field>
      </StorySection>
      <StorySection title="Invalid">
        <Field invalid name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input aria-invalid placeholder="name@example.com" type="email" />
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
      </StorySection>
      <StorySection title="Disabled">
        <Field disabled name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input disabled defaultValue="name@example.com" type="email" />
        </Field>
      </StorySection>
    </div>
  ),
}
