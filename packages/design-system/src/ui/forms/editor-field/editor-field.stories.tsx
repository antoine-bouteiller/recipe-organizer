import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Suspense, type ReactElement } from 'react'

import { useAppForm } from '../../../hooks/use-app-form'
import EditorField from './editor-field'

const EditorFieldExample = ({ disabled = false }: { disabled?: boolean }): ReactElement => {
  const form = useAppForm({ defaultValues: { instructions: '<p>Mix the ingredients until smooth.</p>' }, onSubmit: async () => undefined })

  return (
    <form.AppForm>
      <form.AppField name="instructions">
        {({ EditorField: AppEditorField }) => (
          <Suspense fallback={<p>Loading editor…</p>}>
            <AppEditorField disabled={disabled} label="Instructions" />
          </Suspense>
        )}
      </form.AppField>
    </form.AppForm>
  )
}

const meta = { component: EditorField, tags: ['autodocs'], title: 'Forms/EditorField' } satisfies Meta<typeof EditorField>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <EditorFieldExample /> }
export const Disabled: Story = { render: () => <EditorFieldExample disabled /> }
