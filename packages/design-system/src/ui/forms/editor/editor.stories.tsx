import { $createListItemNode, $createListNode, ListItemNode, ListNode } from '@lexical/list'
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ArrowCounterClockwiseIcon } from '@recipe-organizer/design-system/icons/arrow-counter-clockwise'
import { ArrowUUpRightIcon } from '@recipe-organizer/design-system/icons/arrow-u-up-right'
import { ListBulletsIcon } from '@recipe-organizer/design-system/icons/list-bullets'
import { TextBolderIcon } from '@recipe-organizer/design-system/icons/text-bolder'
import { TextItalicIcon } from '@recipe-organizer/design-system/icons/text-italic'
import { TextUnderlineIcon } from '@recipe-organizer/design-system/icons/text-underline'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@recipe-organizer/design-system/toolbar'
import { StorySection } from '@storybook-helpers/story-section'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import { $createParagraphNode, $createTextNode, $getRoot, createEditor } from 'lexical'
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

const proseEditor = createEditor({ nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode] })
proseEditor.update(
  () => {
    $getRoot().append(
      $createHeadingNode('h2').append($createTextNode('Preparation')),
      $createParagraphNode().append($createTextNode('Wash the vegetables before starting.')),
      $createParagraphNode().append($createTextNode('Chop finely').toggleFormat('bold'), $createTextNode(' and cook gently.').toggleFormat('italic')),
      $createListNode('bullet').append(
        $createListItemNode().append($createTextNode('Carrots')),
        $createListItemNode().append($createListNode('bullet').append($createListItemNode().append($createTextNode('Peeled and diced')))),
        $createListItemNode().append($createTextNode('Onions'))
      ),
      $createHeadingNode('h3').append($createTextNode('Cooking')),
      $createListNode('number', 3).append(
        $createListItemNode().append($createTextNode('Heat the pan.')),
        $createListItemNode().append($createTextNode('Add the vegetables.'))
      ),
      $createQuoteNode().append($createTextNode('Keep the heat low for a sweeter flavor.')),
      $createListNode('check').append($createListItemNode(true).append($createTextNode('Ready to serve'))),
      $createParagraphNode().append($createTextNode('Temperature: '), $createTextNode('180°C').toggleFormat('code')),
      $createParagraphNode().append($createTextNode('Serve warm.'))
    )
  },
  { discrete: true }
)
const proseContent = JSON.stringify(proseEditor.getEditorState().toJSON())

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

export const ReadOnlyProse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox')
    await expect(editor).toHaveAttribute('contenteditable', 'false')
    await expect(canvas.getByText('Wash the vegetables before starting.').closest('p')).toHaveStyle('margin-bottom: 16px')
    await expect(canvas.getByText('Carrots').closest('ul')).toHaveStyle({ listStyleType: 'disc' })
    const nestedList = canvas.getByText('Peeled and diced').closest('ul')
    await expect(nestedList).toHaveStyle('list-style-type: disc; padding-inline-start: 22px')
    await expect(nestedList?.parentElement).toHaveStyle({ listStyleType: 'none' })
    await expect(canvas.getByText('Heat the pan.').closest('ol')).toHaveStyle({ listStyleType: 'decimal' })
    await expect(canvas.getByText('Heat the pan.').closest('ol')).toHaveAttribute('start', '3')
    await expect(canvas.getByText('Ready to serve').closest('ul')).toHaveStyle({ listStyleType: 'none' })
    await expect(canvas.getByText('Keep the heat low for a sweeter flavor.').closest('blockquote')).toHaveStyle({ borderInlineStartWidth: '3px' })
    await expect(canvas.getByText('180°C')).toHaveStyle({ fontFamily: 'monospace' })
    await expect(canvas.getByRole('heading', { name: 'Preparation' })).toHaveStyle('margin-top: 0px')
    await expect(canvas.getByText('Serve warm.').closest('p')).toHaveStyle('margin-bottom: 0px')
  },
  render: () => (
    <Editor content={proseContent} readOnly>
      <EditorContent width="reading" />
    </Editor>
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
