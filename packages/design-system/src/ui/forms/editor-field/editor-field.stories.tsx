import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { Suspense, type ReactElement } from 'react'

import EditorField from './editor-field'

import * as styles from './editor-field.stories.css'

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

const meta = { component: EditorField, title: 'Forms/EditorField' } satisfies Meta<typeof EditorField>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {
  render: () => (
    <div className={styles.storySections}>
      <StorySection title="Default">
        <EditorFieldExample />
      </StorySection>
      <StorySection title="Disabled">
        <EditorFieldExample disabled />
      </StorySection>
    </div>
  ),
}
