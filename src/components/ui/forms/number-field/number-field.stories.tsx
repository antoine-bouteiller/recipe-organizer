import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { FormErrorsContext } from '../form/form'
import { NumberField } from './number-field'

import * as styles from './number-field.stories.css'

const NumberFieldExample = ({
  disabled = false,
  invalid = false,
  initialValue,
}: {
  disabled?: boolean
  invalid?: boolean
  initialValue?: number
}): ReactElement => {
  const [value, setValue] = useState<number | undefined>(initialValue)
  return (
    <FormErrorsContext value={invalid ? { servings: 'Invalid' } : {}}>
      <NumberField name="servings" value={value} onChange={setValue} disabled={disabled} label="Servings" min={1} placeholder="4" />
    </FormErrorsContext>
  )
}

const meta = { component: NumberFieldExample, title: 'Forms/NumberField' } satisfies Meta<typeof NumberFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <NumberFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <NumberFieldExample initialValue={4} />
      </StorySection>
      <StorySection title="Invalid">
        <NumberFieldExample initialValue={20} invalid />
      </StorySection>
      <StorySection title="Disabled">
        <NumberFieldExample disabled initialValue={4} />
      </StorySection>
    </div>
  ),
}

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const input = within(section).getByRole('textbox', { name: 'Servings' })
    await userEvent.type(input, '2,5')
    await expect(input).toHaveValue('2,5')
    await userEvent.click(within(section).getByRole('button', { name: 'Increase' }))
    await expect(input).toHaveValue('3.5')
    await userEvent.clear(input)
    await userEvent.type(input, '-3')
    await userEvent.tab()
    await expect(input).toHaveValue('1')
    await expect(within(section).getByRole('button', { name: 'Decrease' })).toBeDisabled()
  },
  tags: ['!dev'],
}
