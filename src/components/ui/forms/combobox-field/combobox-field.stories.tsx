import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import { FormErrorsContext } from '../form/form'
import { ComboboxField } from './combobox-field'
import type { Option } from './options'

import * as styles from './combobox-field.stories.css'

const options = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

interface ComboboxFieldExampleProps {
  disabled?: boolean
  initialValue?: string
  invalid?: boolean
  options?: Option<string>[]
}

const ComboboxFieldExample = ({
  disabled = false,
  initialValue,
  invalid = false,
  options: items = options,
}: ComboboxFieldExampleProps): ReactElement => {
  const [value, setValue] = useState<string | undefined>(initialValue)
  return (
    <FormErrorsContext value={invalid ? { meal: 'Invalid' } : {}}>
      <ComboboxField name="meal" value={value} onChange={setValue} disabled={disabled} label="Meal" options={items} />
    </FormErrorsContext>
  )
}

const meta = { component: ComboboxFieldExample, title: 'Forms/ComboboxField' } satisfies Meta<typeof ComboboxFieldExample>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const [trigger] = within(canvasElement).getAllByRole('button', { name: 'Sélectionner une option' })
    await userEvent.click(trigger)
    const search = await screen.findByPlaceholderText('Rechercher une option')
    await userEvent.type(search, 'lun')
    const popup = within(search.closest<HTMLElement>('[data-slot=popover-popup], [data-slot=drawer-popup]') ?? document.body)
    await expect(popup.queryByRole('button', { name: 'Dinner' })).not.toBeInTheDocument()
    await userEvent.click(popup.getByRole('button', { name: 'Lunch' }))
    await waitFor(() => expect(screen.queryByPlaceholderText('Rechercher une option')).not.toBeInTheDocument())
    await expect(trigger).toHaveTextContent('Lunch')
  },
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <ComboboxFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <ComboboxFieldExample initialValue="dinner" />
      </StorySection>
      <StorySection title="Invalid">
        <ComboboxFieldExample invalid />
      </StorySection>
      <StorySection title="Disabled">
        <ComboboxFieldExample disabled initialValue="breakfast" />
      </StorySection>
      <StorySection title="Empty">
        <ComboboxFieldExample options={[]} />
      </StorySection>
    </div>
  ),
}

export const Mobile: Story = {
  ...Overview,
  globals: { viewport: { isRotated: false, value: 'mobile2' } },
}
