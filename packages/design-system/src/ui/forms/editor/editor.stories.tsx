import { type Meta, type StoryObj } from '@storybook/react-vite'
import { useState, type ReactElement } from 'react'

import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../../actions/toolbar/toolbar'
import { ArrowCounterClockwiseIcon } from '../../data-display/icons/arrow-counter-clockwise'
import { ArrowUUpRightIcon } from '../../data-display/icons/arrow-u-up-right'
import { ListBulletsIcon } from '../../data-display/icons/list-bullets'
import { TextBolderIcon } from '../../data-display/icons/text-bolder'
import { TextItalicIcon } from '../../data-display/icons/text-italic'
import { TextUnderlineIcon } from '../../data-display/icons/text-underline'
import { Editor, EditorContent, EditorToolbarButton } from './editor'

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
    <div className="space-y-3">
      <section aria-label="Recipe notes editor">
        <Editor content={initialContent} onChange={setContent}>
          <EditorToolbar />
          <EditorContent />
        </Editor>
      </section>
      <output className="block rounded-md bg-muted p-3 text-xs">{content}</output>
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

const meta = {
  component: ControlledEditor,
  tags: ['autodocs'],
  title: 'Forms/Editor',
} satisfies Meta<typeof ControlledEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = {}
export const ReadOnly: Story = { render: () => <ReadOnlyEditor /> }
