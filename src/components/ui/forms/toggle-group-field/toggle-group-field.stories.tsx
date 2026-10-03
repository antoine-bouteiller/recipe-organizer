import { StorySection } from '@storybook-helpers/story-section'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { FormErrorsContext } from '../form/form'
import { ToggleGroupField } from './toggle-group-field'

import * as styles from './toggle-group-field.stories.css'

const emptyMeals: string[] = []

const items = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

const ToggleGroupFieldExample = ({ disabled = false, initialValue = emptyMeals }: { disabled?: boolean; initialValue?: string[] }): ReactElement => {
  const [value, setValue] = useState<string[]>(initialValue)
  return (
    <FormErrorsContext value={{}}>
      <ToggleGroupField name="meals" value={value} onChange={setValue} disabled={disabled} items={items} label="Meals" />
    </FormErrorsContext>
  )
}

const meta = { component: ToggleGroupFieldExample, title: 'Forms/ToggleGroupField' } satisfies Meta<typeof ToggleGroupFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.container}>
      <StorySection title="Default">
        <ToggleGroupFieldExample />
      </StorySection>
      <StorySection title="Initial Value">
        <ToggleGroupFieldExample initialValue={['lunch']} />
      </StorySection>
      <StorySection title="Disabled">
        <ToggleGroupFieldExample disabled initialValue={['lunch']} />
      </StorySection>
    </div>
  ),
}
