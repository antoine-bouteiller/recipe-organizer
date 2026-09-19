import { useAppForm } from '@recipe-organizer/design-system/hooks/use-app-form'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from 'lexical'
import { Suspense, type ReactElement } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import EditorField from './editor-field'

import * as styles from './editor-field.stories.css'

const initialEditor = createEditor()
initialEditor.update(
  () => {
    $getRoot().append($createParagraphNode().append($createTextNode('Mix the ingredients until smooth.')))
  },
  { discrete: true }
)
const initialContent = JSON.stringify(initialEditor.getEditorState().toJSON())

const EditorFieldExample = ({ disabled = false }: { disabled?: boolean }): ReactElement => {
  const form = useAppForm({ defaultValues: { instructions: initialContent }, onSubmit: async () => undefined })

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

export const Interaction: Story = {
  ...Overview,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editable = await within(canvas.getByRole('region', { name: 'Default' })).findByRole('textbox')
    const disabled = await within(canvas.getByRole('region', { name: 'Disabled' })).findByRole('textbox')
    await expect(editable).toHaveTextContent('Mix the ingredients until smooth.')
    await expect(disabled).toHaveTextContent('Mix the ingredients until smooth.')
    await expect(disabled).toHaveAttribute('contenteditable', 'false')
    await userEvent.click(editable)
    await expect(editable).toHaveFocus()
    await expect(editable).toHaveAttribute('contenteditable', 'true')
  },
  tags: ['!dev'],
}
