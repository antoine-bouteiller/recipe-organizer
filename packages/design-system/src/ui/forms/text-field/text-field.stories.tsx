import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { TextField } from './text-field'

import * as styles from './text-field.stories.css'

const TextFieldExample = ({ disabled = false, initialValue = '' }: { disabled?: boolean; initialValue?: string }): ReactElement => {
  const form = useAppForm({ defaultValues: { title: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="title">
        {({ TextField: AppTextField }) => <AppTextField disabled={disabled} label="Recipe title" placeholder="Tomato soup" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: TextField, title: 'Forms/TextField' } satisfies Meta<typeof TextField>
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
