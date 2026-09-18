import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'
import { ArrowUUpRightIcon } from '@recipe-organizer/design-system/icons/arrow-u-up-right'
import { ListBulletsIcon } from '@recipe-organizer/design-system/icons/list-bullets'
import { TextBolderIcon } from '@recipe-organizer/design-system/icons/text-bolder'
import { TextItalicIcon } from '@recipe-organizer/design-system/icons/text-italic'
import { TextUnderlineIcon } from '@recipe-organizer/design-system/icons/text-underline'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@recipe-organizer/design-system/toolbar'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, within } from 'storybook/test'

import { Editor, EditorContent, EditorToolbarButton } from './editor'

import * as styles from './editor.stories.css'

const initialContent = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'A short note for this recipe.',
            type: 'text',
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})

const EditorToolbar = (): ReactElement => (
  <Toolbar aria-label="Text formatting tools">
    <ToolbarGroup aria-label="History">
      <EditorToolbarButton command="undo">
        <ArrowCounterClockwiseIcon aria-hidden="true" />
      </EditorToolbarButton>
      <EditorToolbarButton command="redo">
        <ArrowUUpRightIcon aria-hidden="true" />
      </EditorToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup aria-label="Text formatting">
      <EditorToolbarButton command="bold">
        <TextBolderIcon aria-hidden="true" />
      </EditorToolbarButton>
      <EditorToolbarButton command="italic">
        <TextItalicIcon aria-hidden="true" />
      </EditorToolbarButton>
      <EditorToolbarButton command="underline">
        <TextUnderlineIcon aria-hidden="true" />
      </EditorToolbarButton>
      <EditorToolbarButton command="bulletList">
        <ListBulletsIcon aria-hidden="true" />
      </EditorToolbarButton>
    </ToolbarGroup>
  </Toolbar>
)

const ControlledEditor = (): ReactElement => {
  const [content, setContent] = useState(initialContent)

  return (
    <div className={styles.storyStack}>
      <section aria-label="Recipe notes editor">
        <Editor content={initialContent} onChange={setContent}>
          <EditorToolbar />
          <EditorContent />
        </Editor>
      </section>
      <output className={styles.storyOutput}>{content}</output>
    </div>
  )
}

const ReadOnlyEditor = (): ReactElement => (
  <section aria-label="Recipe notes">
    <Editor content={initialContent} readOnly>
      <EditorContent />
    </Editor>
  </section>
)

const ReadingWidthEditor = (): ReactElement => (
  <section aria-label="Recipe notes with reading width">
    <Editor content={initialContent}>
      <EditorContent width="reading" />
    </Editor>
  </section>
)

const NestedEditor = (): ReactElement => (
  <div data-editor-decorator="">
    <button type="button">Decorator action</button>
    <Editor content={initialContent}>
      <EditorToolbar />
      <EditorContent />
    </Editor>
  </div>
)

const DisabledEditor = (): ReactElement => (
  <Editor content={initialContent}>
    <EditorContent disabled />
  </Editor>
)

const meta = {
  component: ControlledEditor,
  title: 'Forms/Editor',
} satisfies Meta<typeof ControlledEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className={styles.storySections}>
      <StorySection title="Controlled">
        <ControlledEditor />
      </StorySection>
      <StorySection title="Read Only">
        <ReadOnlyEditor />
      </StorySection>
      <StorySection title="Reading Width">
        <ReadingWidthEditor />
      </StorySection>
    </div>
  ),
}

export const Disabled: Story = {
  play: async ({ canvasElement }) => {
    const editor = within(canvasElement).getByRole('textbox')
    await expect(editor).toHaveAttribute('contenteditable', 'false')
  },
  render: () => <DisabledEditor />,
}

export const Nested: Story = {
  render: () => <NestedEditor />,
}
