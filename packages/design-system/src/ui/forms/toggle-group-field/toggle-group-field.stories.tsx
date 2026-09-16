import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'

import { container } from './toggle-group-field.stories.css'

const emptyMeals: string[] = []

const items = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
]

const ToggleGroupFieldExample = ({ disabled = false, initialValue = emptyMeals }: { disabled?: boolean; initialValue?: string[] }): ReactElement => {
  const form = useAppForm({ defaultValues: { meals: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="meals">
        {({ ToggleGroupField: AppToggleGroupField }) => <AppToggleGroupField disabled={disabled} items={items} label="Meals" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: ToggleGroupFieldExample, title: 'Forms/ToggleGroupField' } satisfies Meta<typeof ToggleGroupFieldExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={container}>
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
