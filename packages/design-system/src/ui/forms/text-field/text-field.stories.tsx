import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { useAppForm } from '../../../hooks/use-app-form'
import { TextField } from './text-field'

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
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', { name: 'Default' })
    const input = within(section).getByRole('textbox', { name: 'Recipe title' })
    await userEvent.type(input, 'Tomato soup')
    await expect(input).toHaveValue('Tomato soup')
  },
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: 0, width: 'full' })}>
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
