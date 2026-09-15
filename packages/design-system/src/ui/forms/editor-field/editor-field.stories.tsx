import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Suspense, type ReactElement } from 'react'

import { StorySection } from '../../../../.storybook/story-section'
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
export const Overview: Story = {
  render: () => (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <StorySection title="Default">
        <EditorFieldExample />
      </StorySection>
      <StorySection title="Disabled">
        <EditorFieldExample disabled />
      </StorySection>
    </div>
  ),
}
