import { MagimixProgramNode } from '@/components/tiptap/magimix-program-node'
import { cn } from '@/utils/cn'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import type { CanCommands, ChainedCommands, EditorContentProps } from '@tiptap/react'
import { EditorContent, EditorContext, useEditor, useEditorState } from '@tiptap/react'
import { useContext } from 'react'
import { Toggle } from './toggle'
import { ToolbarButton } from './toolbar'

// Import only the extensions we actually use (instead of StarterKit)
const extensions = [
  Document,
  Text,
  Paragraph,
  HardBreak,
  Bold,
  Italic,
  Underline,
  BulletList,
  ListItem,
  History,
  MagimixProgramNode,
]

type Command =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'undo'
  | 'redo'

const canCommand = {
  bold: 'toggleBold',
  italic: 'toggleItalic',
  underline: 'toggleUnderline',
  bulletList: 'toggleBulletList',
  orderedList: 'toggleOrderedList',
  taskList: 'toggleTaskList',
  undo: 'undo',
  redo: 'redo',
} as const satisfies Record<Command, keyof CanCommands>

const runCommand = {
  bold: 'toggleBold',
  italic: 'toggleItalic',
  underline: 'toggleUnderline',
  bulletList: 'toggleBulletList',
  orderedList: 'toggleOrderedList',
  taskList: 'toggleTaskList',
  undo: 'undo',
  redo: 'redo',
} as const satisfies Record<Command, keyof ChainedCommands>

interface TiptapButtonProps {
  command: Command
  children: React.ReactNode
}

const TiptapButton = ({ command, children }: TiptapButtonProps) => {
  const { editor } = useContext(EditorContext)

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      canToggle: ctx.editor?.can()[canCommand[command]] ?? false,
      isActive: ctx.editor?.isActive(command) ?? false,
    }),
  })

  const toggle = () => {
    if (!editor?.isEditable) {
      return false
    }
    if (!editorState?.canToggle) {
      return false
    }

    editor.chain().focus()[runCommand[command]]().run()
  }

  return (
    <ToolbarButton
      aria-label={command}
      render={
        <Toggle
          value={command}
          onClick={toggle}
          disabled={!editorState?.canToggle}
          aria-pressed={editorState?.isActive}
          data-pressed={editorState?.isActive === true ? true : undefined}
        />
      }
    >
      {children}
    </ToolbarButton>
  )
}

interface TiptapProps {
  content?: string
  onChange?: (content: string) => void
  children?: React.ReactNode
  readOnly?: boolean
}

const Tiptap = ({ children, content, onChange, readOnly }: TiptapProps) => {
  const editor = useEditor({
    extensions: extensions,
    immediatelyRender: false,
    content,
    autofocus: false,
    editable: !readOnly,
    editorProps: {
      handleScrollToSelection(this, view) {
        if ('focused' in view && !view.focused) {
          return true
        }

        return false
      },
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>
}

const TiptapContent = ({ className, ...props }: Omit<EditorContentProps, 'editor'>) => {
  const { editor } = useContext(EditorContext)

  return (
    <EditorContent
      editor={editor}
      className={cn(
        editor?.isEditable &&
          'p-4 w-full rounded-lg border border-input bg-background bg-clip-padding shadow-xs ring-ring/24 transition-shadow not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]',
        className
      )}
      {...props}
    />
  )
}

export { Tiptap, TiptapButton, TiptapContent }
