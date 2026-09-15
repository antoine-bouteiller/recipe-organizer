import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { CheckboxField } from './checkbox-field'

const CheckboxFieldExample = ({ disabled = false, initialValue = false }: { disabled?: boolean; initialValue?: boolean }): ReactElement => {
  const form = useAppForm({ defaultValues: { published: initialValue }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="published">
        {({ CheckboxField: AppCheckboxField }) => <AppCheckboxField disabled={disabled} label="Published" />}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: CheckboxField, tags: ['autodocs'], title: 'Forms/CheckboxField' } satisfies Meta<typeof CheckboxField>
export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const checkbox = within(section).getByRole('checkbox', { name: 'Published' })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <CheckboxFieldExample />
      </StorySection>
      <StorySection title="Checked">
        <CheckboxFieldExample initialValue />
      </StorySection>
      <StorySection title="Disabled">
        <CheckboxFieldExample disabled initialValue />
      </StorySection>
    </div>
  ),
}
