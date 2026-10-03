import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { FormErrorsContext } from '../form/form'
import { TextField } from './text-field'

import * as styles from './text-field.stories.css'

const TextFieldExample = ({
  disabled = false,
  invalid = false,
  initialValue = '',
}: {
  disabled?: boolean
  invalid?: boolean
  initialValue?: string
}): ReactElement => {
  const [value, setValue] = useState<string>(initialValue)
  return (
    <FormErrorsContext value={invalid ? { title: 'Invalid' } : {}}>
      <TextField name="title" value={value} onChange={setValue} disabled={disabled} label="Recipe title" placeholder="Tomato soup" />
    </FormErrorsContext>
  )
}

const meta = { component: TextFieldExample, title: 'Forms/TextField' } satisfies Meta<typeof TextFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <TextFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <TextFieldExample initialValue="Tomato soup" />
      </StorySection>
      <StorySection title="Invalid">
        <TextFieldExample initialValue="Tomato soup" invalid />
      </StorySection>
      <StorySection title="Disabled">
        <TextFieldExample disabled initialValue="Tomato soup" />
      </StorySection>
    </div>
  ),
}

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const input = within(section).getByRole('textbox', { name: 'Recipe title' })
    await userEvent.type(input, 'Tomato soup')
    await expect(input).toHaveValue('Tomato soup')
  },
  tags: ['!dev'],
}
