import { type Meta, type StoryObj } from '@storybook/react-vite'

import { StorySection } from '../../../../.storybook/story-section'
import { Input } from '../input/input'
import { Field, FieldControl, FieldError, FieldLabel } from './field'

const meta = {
  component: Field,
  tags: ['autodocs'],
  title: 'Forms/Field',
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <Field name="email">
          <FieldLabel>Email address</FieldLabel>
          <FieldControl render={<Input placeholder="name@example.com" type="email" />} />
        </Field>
      </StorySection>
      <StorySection title="Invalid">
        <Field invalid name="email">
          <FieldLabel>Email address</FieldLabel>
          <FieldControl render={<Input aria-invalid placeholder="name@example.com" type="email" />} />
          <FieldError>Please enter a valid email address.</FieldError>
        </Field>
      </StorySection>
      <StorySection title="Disabled">
        <Field disabled name="email">
          <FieldLabel>Email address</FieldLabel>
          <FieldControl render={<Input disabled defaultValue="name@example.com" type="email" />} />
        </Field>
      </StorySection>
    </div>
  ),
}
