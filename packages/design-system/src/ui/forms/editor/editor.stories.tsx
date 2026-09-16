import { css } from '@recipe-organizer/design-system/css'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'
import { expect, within } from 'storybook/test'

import { StorySection } from '../../../../.storybook/story-section'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../../actions/toolbar/toolbar'
import { ArrowCounterClockwiseIcon } from '../../data-display/icons/arrow-counter-clockwise'
import { ArrowUUpRightIcon } from '../../data-display/icons/arrow-u-up-right'
import { ListBulletsIcon } from '../../data-display/icons/list-bullets'
import { TextBolderIcon } from '../../data-display/icons/text-bolder'
import { TextItalicIcon } from '../../data-display/icons/text-italic'
import { TextUnderlineIcon } from '../../data-display/icons/text-underline'
import { Editor, EditorContent, EditorToolbarButton } from './editor'

const storyStack = css({ display: 'flex', flexDirection: 'column', gap: '3' })
const storyOutput = css({ backgroundColor: 'muted', borderRadius: 'md', display: 'block', fontSize: 'xs', padding: '3' })
const storySections = css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0', width: 'full' })

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
    <div className={storyStack}>
      <section aria-label="Recipe notes editor">
        <Editor content={initialContent} onChange={setContent}>
          <EditorToolbar />
          <EditorContent />
        </Editor>
      </section>
      <output className={storyOutput}>{content}</output>
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
    <div className={storySections}>
      <StorySection title="Controlled">
        <ControlledEditor />
      </StorySection>
      <StorySection title="Read Only">
        <ReadOnlyEditor />
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
